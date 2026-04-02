import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, SafeAreaView, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Conexión Backend NestJS
  const [productsAPI, setProductsAPI] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/products')
      .then(res => res.json())
      .then(data => {
        setProductsAPI(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al conectar con NestJS:", err);
        setLoading(false);
      });
  }, []);

  // Novedad: Lógica del Carrito de Compras
  const [cart, setCart] = useState<any[]>([]);
  const [isCartVisible, setIsCartVisible] = useState(false);

  const addToCart = (product: any) => {
    // Generar un ID único por si añaden el mismo producto múltiples veces
    const itemWithCartId = { ...product, cartId: Math.random().toString() };
    setCart([...cart, itemWithCartId]);
    if (Platform.OS === 'web') {
      alert(`¡${product.name} añadido al carrito!`);
    } else {
      Alert.alert("Éxito", `¡${product.name} añadido al carrito!`);
    }
  };

  const removeFromCart = (cartId: string) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const checkout = () => {
    if (cart.length === 0) return;
    if (Platform.OS === 'web') alert("¡Compra realizada con éxito! Revisa tu correo electrónico.");
    else Alert.alert("¡Compra Realizada!", "Tu pedido llegará pronto.");
    setCart([]);
    setIsCartVisible(false);
    setSelectedProduct(null);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.priceValue, 0);

  // ---------- RENDERIZADOS ----------

  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => setSelectedProduct(item)}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
        {item.tag ? <View style={styles.badge}><Text style={styles.badgeText}>{item.tag}</Text></View> : null}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const HomeContent = (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Torres<Text style={{color: '#007AFF'}}>Store</Text></Text>
        <TouchableOpacity style={styles.cartIcon} onPress={() => setIsCartVisible(true)}>
          <Text style={{ fontSize: 20 }}>🛒</Text>
          {cart.length > 0 && <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{cart.length}</Text></View>}
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Colección{'\n'}Premium 2026</Text>
          <TouchableOpacity style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>Ver Tienda</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tendencias Globales</Text>
          <TouchableOpacity><Text style={styles.sectionSubtitle}>Ver más</Text></TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 40 }} />
        ) : (
          <FlatList
            data={productsAPI}
            renderItem={renderProduct}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );

  const DetailsContent = selectedProduct && (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <StatusBar style="light" />
      <ScrollView bounces={false} style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.detailsImageWrapper}>
          <Image source={{ uri: selectedProduct.image }} style={styles.detailsImage} />
          <TouchableOpacity style={styles.backButton} onPress={() => setSelectedProduct(null)}>
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.cartIcon, position: 'absolute', top: Platform.OS === 'android' ? 50 : 30, right: 20 }} onPress={() => setIsCartVisible(true)}>
            <Text style={{ fontSize: 18 }}>🛒</Text>
            {cart.length > 0 && <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{cart.length}</Text></View>}
          </TouchableOpacity>
        </View>

        <View style={styles.detailsContentWrapper}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <Text style={styles.detailsTitle}>{selectedProduct.name}</Text>
            <Text style={styles.detailsPrice}>{selectedProduct.price}</Text>
          </View>
          
          <View style={{ flexDirection: 'row', gap: 10, marginVertical: 15 }}>
            <View style={{ backgroundColor: '#F0F0F0', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20 }}>
              <Text style={{ fontWeight: 'bold', color: '#1A1A1A' }}>⭐️ 4.9</Text>
            </View>
            <View style={{ backgroundColor: 'rgba(0, 122, 255, 0.1)', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20 }}>
              <Text style={{ fontWeight: 'bold', color: '#007AFF' }}>Envío Gratis</Text>
            </View>
          </View>

          <Text style={styles.detailsSubtitle}>Descripción</Text>
          <Text style={styles.detailsDesc}>{selectedProduct.desc}</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.addToCartSpecialButton} onPress={() => addToCart(selectedProduct)}>
          <Text style={styles.addToCartSpecialText}>Añadir al carrito</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const CartContent = (
    <View style={{ flex: 1, backgroundColor: '#F8F9FB' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{...styles.header, backgroundColor: '#FFF'}}>
          <Text style={styles.headerTitle}>Tu Carrito</Text>
          <TouchableOpacity onPress={() => setIsCartVisible(false)}>
            <Text style={{ fontSize: 18, color: '#FF3B30', fontWeight: 'bold' }}>Cerrar ✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1, padding: 20 }}>
          {cart.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Text style={{ fontSize: 50 }}>🛒</Text>
              <Text style={{ fontSize: 18, color: '#666', marginTop: 20 }}>Tu carrito está vacío</Text>
            </View>
          ) : (
            cart.map((item, index) => (
              <View key={item.cartId} style={{ flexDirection: 'row', backgroundColor: '#FFF', padding: 15, borderRadius: 15, marginBottom: 15, alignItems: 'center' }}>
                <Image source={{uri: item.image}} style={{ width: 60, height: 60, borderRadius: 10 }} />
                <View style={{ flex: 1, marginLeft: 15 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
                  <Text style={{ color: '#007AFF', fontWeight: '700', marginTop: 5 }}>{item.price}</Text>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item.cartId)} style={{ padding: 10 }}>
                  <Text style={{ color: '#FF3B30', fontSize: 14, fontWeight: 'bold' }}>Quitar</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.bottomBar}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: '600' }}>Total:</Text>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#1A1A1A' }}>${cartTotal}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.addToCartSpecialButton, { backgroundColor: cart.length > 0 ? '#007AFF' : '#CCC' }]} 
            disabled={cart.length === 0}
            onPress={checkout}
          >
            <Text style={styles.addToCartSpecialText}>Finalizar Compra</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );

  let activeContent;
  if (isCartVisible) activeContent = CartContent;
  else if (selectedProduct) activeContent = DetailsContent;
  else activeContent = HomeContent;

  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, backgroundColor: '#ECEFF1', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <View style={{ width: 380, height: 800, backgroundColor: '#FFF', borderRadius: 45, overflow: 'hidden', borderWidth: 12, borderColor: '#1A1A1A', boxShadow: '0px 25px 50px rgba(0,0,0,0.15)', position: 'relative' }}>
          <View style={{ position: 'absolute', top: 5, left: '50%', transform: [{ translateX: -60 }], width: 120, height: 30, backgroundColor: '#1A1A1A', borderRadius: 20, zIndex: 100 }} />
          {activeContent}
        </View>
      </View>
    );
  }

  return activeContent;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB', paddingTop: Platform.OS === 'android' ? 40 : 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#1A1A1A' },
  cartIcon: { padding: 8, backgroundColor: '#FFF', borderRadius: 50, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, position: 'relative' },
  cartBadge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#FF3B30', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#F8F9FB' },
  cartBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  banner: { margin: 20, backgroundColor: '#1A1A1A', borderRadius: 24, padding: 30, minHeight: 180, justifyContent: 'center', shadowColor: '#007AFF', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 10 }, shadowRadius: 20, elevation: 10 },
  bannerTitle: { color: '#FFF', fontSize: 28, fontWeight: '800', marginBottom: 15 },
  bannerButton: { backgroundColor: '#007AFF', alignSelf: 'flex-start', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 100 },
  bannerButtonText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 20, marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A1A' },
  sectionSubtitle: { fontSize: 14, color: '#007AFF', fontWeight: '600' },
  listContainer: { paddingHorizontal: 15 },
  card: { backgroundColor: '#FFF', borderRadius: 20, marginHorizontal: 5, width: 220, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 8 }, shadowRadius: 15, elevation: 4, overflow: 'hidden' },
  imageContainer: { height: 200, width: '100%', backgroundColor: '#F0F0F0', position: 'relative' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  badge: { position: 'absolute', top: 15, left: 15, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '800', color: '#1A1A1A', letterSpacing: 1 },
  infoContainer: { padding: 15, position: 'relative' },
  productName: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 5, paddingRight: 30 },
  productPrice: { fontSize: 15, fontWeight: '800', color: '#007AFF' },
  addButton: { position: 'absolute', right: 15, bottom: 15, backgroundColor: '#1A1A1A', width: 35, height: 35, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  addButtonText: { color: '#FFF', fontSize: 20, fontWeight: '400' },
  detailsImageWrapper: { width: '100%', height: 480, backgroundColor: '#F0F0F0', position: 'relative' },
  detailsImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  backButton: { position: 'absolute', top: Platform.OS === 'android' ? 50 : 30, left: 20, backgroundColor: 'rgba(255,255,255,0.85)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  backButtonText: { fontWeight: '700', color: '#1A1A1A', fontSize: 14 },
  detailsContentWrapper: { padding: 24, backgroundColor: '#FFF', borderTopLeftRadius: 35, borderTopRightRadius: 35, marginTop: -35, minHeight: 400 },
  detailsTitle: { fontSize: 26, fontWeight: '900', color: '#1A1A1A', maxWidth: '70%' },
  detailsPrice: { fontSize: 26, fontWeight: '800', color: '#007AFF' },
  detailsSubtitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginTop: 15, marginBottom: 10 },
  detailsDesc: { fontSize: 15, color: '#666', lineHeight: 24 },
  bottomBar: { padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#EFEFEF', paddingBottom: Platform.OS === 'ios' ? 30 : 20 },
  addToCartSpecialButton: { backgroundColor: '#1A1A1A', width: '100%', paddingVertical: 18, borderRadius: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 5 }, shadowRadius: 10, elevation: 5 },
  addToCartSpecialText: { color: '#FFF', fontSize: 18, fontWeight: '700' }
});
