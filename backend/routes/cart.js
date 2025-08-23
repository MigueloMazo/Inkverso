const express = require('express');
const router = express.Router();
const supabase = require('../config/db');

// Agregar libro al carrito
router.post('/add', async (req, res) => {
  const { user_id, book_id, quantity } = req.body;

  try {
    // Revisar si ya hay una orden pendiente para ese usuario
    let { data: existingOrders, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user_id)
      .eq('status', 'pending')
      .limit(1);

    if (orderError) throw orderError;

    let orderId;
    if (!existingOrders || existingOrders.length === 0) {
      // Crear nueva orden
      const { data: newOrder, error: newOrderError } = await supabase
        .from('orders')
        .insert([{ user_id, status: 'pending', total_amount: 0 }])
        .select()
        .single();

      if (newOrderError) throw newOrderError;
      orderId = newOrder.id;
    } else {
      orderId = existingOrders[0].id;
    }

    // Revisar si el libro ya está en el carrito
    const { data: existingItem, error: itemError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)
      .eq('book_id', book_id)
      .single();

    if (itemError && itemError.code !== 'PGRST116') throw itemError; // ignora "no rows"

    if (existingItem) {
      // Actualizar cantidad
      const newQuantity = existingItem.quantity + quantity;
      const newTotal = newQuantity * existingItem.unit_price;

      const { error: updateError } = await supabase
        .from('order_items')
        .update({ quantity: newQuantity, total_price: newTotal })
        .eq('id', existingItem.id);

      if (updateError) throw updateError;
    } else {
      // Obtener precio del libro
      const { data: book, error: bookError } = await supabase
        .from('books')
        .select('price')
        .eq('id', book_id)
        .single();

      if (bookError) throw bookError;

      const totalPrice = book.price * quantity;

      // Insertar nuevo item
      const { error: insertError } = await supabase
        .from('order_items')
        .insert([{
          order_id: orderId,
          book_id,
          quantity,
          unit_price: book.price,
          total_price: totalPrice
        }]);

      if (insertError) throw insertError;
    }

    // Recalcular total de la orden
    const { data: items, error: recalcError } = await supabase
      .from('order_items')
      .select('total_price')
      .eq('order_id', orderId);

    if (recalcError) throw recalcError;

    const totalAmount = items.reduce((sum, i) => sum + i.total_price, 0);

    const { error: totalUpdateError } = await supabase
      .from('orders')
      .update({ total_amount: totalAmount })
      .eq('id', orderId);

    if (totalUpdateError) throw totalUpdateError;

    res.json({ message: 'Libro agregado al carrito con éxito', order_id: orderId });
  } catch (err) {
    console.error('⚠️ Error al agregar al carrito:', err.message);
    res.status(500).json({ error: 'Error al agregar al carrito' });
  }
});

// Obtener carrito de un usuario 
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id,
        status,
        total_amount,
        created_at,
        order_items (
          id,
          quantity,
          unit_price,
          total_price,
          book:books (id, title, author, cover_url, price)
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'pending')
      .limit(1);

    if (error) throw error;

    if (!orders || orders.length === 0) {
      return res.json({ cart: null });
    }

    res.json({ cart: orders[0] });
  } catch (err) {
    console.error('⚠️ Error al obtener carrito:', err.message);
    res.status(500).json({ error: 'Error al obtener carrito' });
  }
});

// Actualizar cantidad de un item
router.put('/update/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  try {
    const { data: item, error: fetchError } = await supabase
      .from('order_items')
      .select('*')
      .eq('id', itemId)
      .single();

    if (fetchError) throw fetchError;

    const newTotal = item.unit_price * quantity;

    const { error: updateError } = await supabase
      .from('order_items')
      .update({ quantity, total_price: newTotal })
      .eq('id', itemId);

    if (updateError) throw updateError;

    res.json({ message: 'Cantidad actualizada con éxito' });
  } catch (err) {
    console.error('⚠️ Error al actualizar cantidad:', err.message);
    res.status(500).json({ error: 'Error al actualizar cantidad' });
  }
});

// Eliminar un item
router.delete('/remove/:itemId', async (req, res) => {
  const { itemId } = req.params;

  try {
    const { error } = await supabase
      .from('order_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;

    res.json({ message: 'Item eliminado del carrito' });
  } catch (err) {
    console.error('⚠️ Error al eliminar item:', err.message);
    res.status(500).json({ error: 'Error al eliminar item' });
  }
});

// Finalizar compra 
router.post('/checkout/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { address, paymentMethod } = req.body;

  try {
    // Obtener datos de la orden antes de marcarla como pagada
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          unit_price,
          total_price,
          book:books (title, author)
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError) throw orderError;

    // Marcar la orden como pagada
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        status: 'paid',
        shipping_address: address,
        payment_method: paymentMethod
      })
      .eq('id', orderId);

    if (updateError) throw updateError;

    console.log('📧 Enviando confirmación de compra:', {
      orderId,
      total: order.total_amount,
      items: order.order_items.length,
      address
    });

    res.json({ 
      message: 'Compra finalizada con éxito',
      order: {
        id: orderId,
        total: order.total_amount,
        items: order.order_items,
        address
      }
    });
  } catch (err) {
    console.error('⚠️ Error en checkout:', err.message);
    res.status(500).json({ error: 'Error en checkout' });
  }
});

// Crear preferencia de MercadoPago
router.post('/mercadopago/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { address } = req.body;

  try {
    // Obtener datos de la orden
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          unit_price,
          book:books (title)
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError) throw orderError;

    // En producción, aquí se usa el SDK de MercadoPago
    const preference = {
      id: `PREF_${orderId}_${Date.now()}`,
      items: order.order_items.map(item => ({
        title: item.book.title,
        quantity: item.quantity,
        unit_price: item.unit_price
      })),
      back_urls: {
        success: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pago-exitoso`,
        failure: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pago-fallido`,
        pending: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pago-pendiente`
      },
      external_reference: orderId
    };

    console.log('💳 Preferencia MercadoPago creada:', preference.id);

    res.json({ 
      preference_id: preference.id,
      init_point: `https://www.mercadopago.com.co/checkout/v1/redirect?pref_id=${preference.id}`
    });
  } catch (err) {
    console.error('⚠️ Error creando preferencia MP:', err.message);
    res.status(500).json({ error: 'Error procesando pago' });
  }
});

module.exports = router;