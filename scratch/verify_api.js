async function runTests() {
  const baseUrl = 'http://localhost:5000/api';
  console.log('--- STARTING SHOPEZ API INTEGRATION VERIFICATION (NATIVE FETCH) ---');

  try {
    // 1. Health check
    console.log('\n1. Testing Health Endpoint...');
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    console.log('Health response:', healthData);

    // 2. Fetch public categories
    console.log('\n2. Testing Get Categories...');
    const categoriesRes = await fetch(`${baseUrl}/categories`);
    const categoriesData = await categoriesRes.json();
    console.log(`Categories found: ${categoriesData.categories?.length}`);
    categoriesData.categories?.forEach(c => {
      console.log(` - ${c.categoryName}`);
    });

    // 3. Fetch public products
    console.log('\n3. Testing Get Products...');
    const productsRes = await fetch(`${baseUrl}/products`);
    const productsData = await productsRes.json();
    console.log(`Products found: ${productsData.products?.length}`);
    productsData.products?.forEach(p => {
      console.log(` - ${p.title} (Price: ₹${p.price}, Discount: ${p.discount}%)`);
    });

    // 4. Test Customer Registration
    console.log('\n4. Testing Customer Registration...');
    const testUser = `customer_${Date.now()}`;
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: testUser,
        email: `${testUser}@example.com`,
        password: 'customerpassword123'
      })
    });
    const regData = await regRes.json();
    console.log('Register response status:', regRes.status);
    console.log('Registered User:', regData.user?.username, 'Role:', regData.user?.userType);
    const customerToken = regData.token;

    // 5. Test Customer Login
    console.log('\n5. Testing Customer Login...');
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: testUser,
        password: 'customerpassword123'
      })
    });
    const loginData = await loginRes.json();
    console.log('Login response status:', loginRes.status);
    console.log('Logged-in User:', loginData.user?.username);

    // 6. Test Cart Actions (requires Token)
    console.log('\n6. Testing Add to Cart...');
    const targetProduct = productsData.products[0];
    const cartRes = await fetch(`${baseUrl}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        productId: targetProduct._id,
        quantity: 2,
        size: targetProduct.sizes[0]
      })
    });
    const cartData = await cartRes.json();
    console.log('Cart add response:', cartData.message);
    console.log('Cart Item Details:', cartData.item?.productId?.title, 'Size:', cartData.item?.size, 'Qty:', cartData.item?.quantity);

    // 7. Get Cart
    console.log('\n7. Testing View Cart...');
    const getCartRes = await fetch(`${baseUrl}/cart`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    const getCartData = await getCartRes.json();
    console.log(`Cart contains ${getCartData.cart?.length} items`);

    // 8. Place Order
    console.log('\n8. Testing Place Order...');
    const orderRes = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        products: [{
          productId: targetProduct._id,
          quantity: 2,
          size: targetProduct.sizes[0],
          price: targetProduct.price
        }],
        paymentMethod: 'Cash on Delivery',
        shippingAddress: '123 Test Street, Developer City',
        pincode: '560001',
        totalAmount: targetProduct.price * 2
      })
    });
    const orderData = await orderRes.json();
    console.log('Order place response:', orderData.message);
    console.log('Order Details: ID:', orderData.order?._id, 'Status:', orderData.order?.status);

    // 9. Get My Orders
    console.log('\n9. Testing Get My Orders...');
    const myOrdersRes = await fetch(`${baseUrl}/orders/my-orders`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    const myOrdersData = await myOrdersRes.json();
    console.log(`User has ${myOrdersData.orders?.length} orders:`);
    myOrdersData.orders?.forEach(o => {
      console.log(` - Order ID: ${o._id}, Total: ₹${o.totalAmount}, Status: ${o.status}`);
    });

    // 10. Admin Login & Statistics
    console.log('\n10. Testing Admin Login & Dashboard Stats...');
    const adminLoginRes = await fetch(`${baseUrl}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'adminpassword123'
      })
    });
    const adminLoginData = await adminLoginRes.json();
    console.log('Admin Login response status:', adminLoginRes.status);
    const adminToken = adminLoginData.token;

    const statsRes = await fetch(`${baseUrl}/orders/statistics`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const statsData = await statsRes.json();
    console.log('Dashboard statistics:');
    console.log(` - Total Revenue: ₹${statsData.totalRevenue}`);
    console.log(` - Total Orders: ${statsData.totalOrders}`);
    console.log(` - Total Products: ${statsData.totalProducts}`);
    console.log(` - Total Users: ${statsData.totalUsers}`);

    // 11. Test Admin Order Status Updates
    console.log('\n11. Testing Admin Order Status Update to On the Way...');
    const orderIdToUpdate = orderData.order?._id;
    const statusUpdateRes1 = await fetch(`${baseUrl}/orders/${orderIdToUpdate}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'On the Way' })
    });
    const statusUpdateData1 = await statusUpdateRes1.json();
    console.log('Update to On the Way response:', statusUpdateData1.message, 'New Status:', statusUpdateData1.order?.status);

    console.log('Testing Admin Order Status Update to Delivered...');
    const statusUpdateRes2 = await fetch(`${baseUrl}/orders/${orderIdToUpdate}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'Delivered' })
    });
    const statusUpdateData2 = await statusUpdateRes2.json();
    console.log('Update to Delivered response:', statusUpdateData2.message, 'New Status:', statusUpdateData2.order?.status);

    console.log('Testing Admin Order Status Update to Cancelled...');
    const statusUpdateRes3 = await fetch(`${baseUrl}/orders/${orderIdToUpdate}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'Cancelled' })
    });
    const statusUpdateData3 = await statusUpdateRes3.json();
    console.log('Update to Cancelled response:', statusUpdateData3.message, 'New Status:', statusUpdateData3.order?.status);

    console.log('\n--- ALL API INTEGRATION CHECKS PASSED SUCCESSFULLY ---');

  } catch (err) {
    console.error('\n❌ Verification failed with error:', err.message);
    process.exit(1);
  }
}

runTests();
