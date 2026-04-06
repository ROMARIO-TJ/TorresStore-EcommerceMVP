import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, SafeAreaView, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native';

const MOCK_PRODUCTS = [
  { id: '1', name: 'MacBook Pro M3', price: '$1299', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80', tag: 'NUEVO', desc: 'La laptop más avanzada de Apple para profesionales creativos.', priceValue: 1299 },
  { id: '2', name: 'iPhone 15 Pro', price: '$999', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80', tag: 'POPULAR', desc: 'El primer iPhone diseñado con titanio de calidad aeroespacial.', priceValue: 999 },
  { id: '3', name: 'AirPods Max', price: '$549', image: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=500&q=80', tag: '', desc: 'Reinvención total de los audífonos de diadema con cancelación activa.', priceValue: 549 },
  { id: '4', name: 'Apple Watch Ultra', price: '$799', image: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=500&q=80', tag: 'OFERTA', desc: 'El Apple Watch más resistente e intuitivo. Diseñado para exploración.', priceValue: 799 },
];

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [productsAPI, setProductsAPI] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/products')
      .then(res => {
        if (!res.ok) throw new Error("Fallback required");
        return res.json();
      })
      .then(data => {
        setProductsAPI(data);
        setLoading(false);
      })
      .catch(err => {
        setProductsAPI(MOCK_PRODUCTS);
        setLoading(false);
      });
  }, []);

  const [cart, setCart] = useState<any[]>([]);
  const [isCartVisible, setIsCartVisible] = useState(false);

  const addToCart = (product: any) => {
    const itemWithCartId = { ...product, cartId: Math.random().toString() };
    setCart([...cart, itemWithCartId]);
    if (Platform.OS === 'web') alert(`¡${product.name} añadido al carrito!`);
    else Alert.alert("Éxito", `¡${product.name} añadido al carrito!`);
  };

  const removeFromCart = (cartId: string) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const checkout = () => {
    if (cart.length === 0) return;
    alert("¡Compra realizada con éxito!");
    setCart([]);
    setIsCartVisible(false);
    setSelectedProduct(null);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.priceValue, 0);

  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => setSelectedProduct(item)}
      delayPressIn={100}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
        {item.tag ? <View style={styles.badge}><Text style={styles.badgeText}>{item.tag}</Text></View> : null}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)} delayPressIn={100}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const HomeContent = (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Torres<Text style={{ color: '#007AFF' }}>Store</Text></Text>
        <TouchableOpacity style={styles.cartIcon} onPress={() => setIsCartVisible(true)}>
          <Text style={{ fontSize: 20 }}>🛒</Text>
          {cart.length > 0 && <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{cart.length}</Text></View>}
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        // @ts-ignore - touchAction is web-only
        style={{ flex: 1, touchAction: 'auto' }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Colección{'\n'}Premium 2026</Text>
          <TouchableOpacity
            style={styles.bannerButton}
            onPress={() => scrollViewRef.current?.scrollTo({ y: 350, animated: true })}
          >
            <Text style={styles.bannerButtonText}>Ver Tienda</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tendencias Globales</Text>
          <TouchableOpacity onPress={() => {
            if (Platform.OS === 'web') alert("Próximamente nuevas colecciones");
            else Alert.alert("Próximamente", "Estamos preparando nuevas colecciones para ti.");
          }}>
            <Text style={styles.sectionSubtitle}>Ver más</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 40 }} />
        ) : (
          <FlatList
            data={productsAPI}
            renderItem={renderProduct}
            keyExtractor={item => item.id}
            scrollEnabled={false}
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
        </View>
        <View style={styles.detailsContentWrapper}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <Text style={styles.detailsTitle}>{selectedProduct.name}</Text>
            <Text style={styles.detailsPrice}>{selectedProduct.price}</Text>
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
        <View style={{ ...styles.header, backgroundColor: '#FFF' }}>
          <Text style={styles.headerTitle}>Tu Carrito</Text>
          <TouchableOpacity onPress={() => setIsCartVisible(false)}><Text style={{ fontSize: 18, color: '#FF3B30', fontWeight: 'bold' }}>✕</Text></TouchableOpacity>
        </View>
        <ScrollView style={{ flex: 1, padding: 20 }}>
          {cart.map((item) => (
            <View key={item.cartId} style={{ flexDirection: 'row', backgroundColor: '#FFF', padding: 15, borderRadius: 15, marginBottom: 15, alignItems: 'center' }}>
              <Image source={{ uri: item.image }} style={{ width: 60, height: 60, borderRadius: 10 }} />
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                <Text style={{ color: '#007AFF' }}>{item.price}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFromCart(item.cartId)}><Text style={{ color: '#FF3B30' }}>Quitar</Text></TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <View style={styles.bottomBar}>
          <Text style={{ fontSize: 20, fontWeight: '800', marginBottom: 10 }}>Total: ${cartTotal}</Text>
          <TouchableOpacity style={styles.addToCartSpecialButton} onPress={checkout}><Text style={styles.addToCartSpecialText}>Finalizar Compra</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );

  // Check if we are on a mobile device
  const isMobileDevice = typeof window !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Force scroll on mobile browsers
  useEffect(() => {
    if (Platform.OS === 'web' && isMobileDevice) {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
      
      // Inyectar CSS para anular la clase de React Native Web que bloquea el scroll
      const guestStyle = document.createElement('style');
      guestStyle.innerHTML = `
        .r-touchAction-19z077z { 
          touch-action: auto !important; 
        }
        * {
          -webkit-overflow-scrolling: touch;
        }
      `;
      document.head.appendChild(guestStyle);
    }
  }, []);

  let activeContent;
  if (isCartVisible) activeContent = CartContent;
  else if (selectedProduct) activeContent = DetailsContent;
  else activeContent = HomeContent;

  if (Platform.OS === 'web') {
    // On real mobile: show content full-screen (with explicit touch scroll support)
    if (isMobileDevice) {
      return (
        // @ts-ignore - touchAction is web-only
        <View style={{ flex: 1, backgroundColor: '#F8F9FB', minHeight: '100vh', width: '100%', touchAction: 'auto' }}>
          {activeContent}
        </View>
      );
    }

    // On desktop: show decorative phone silhouette
    return (
      // @ts-ignore - touchAction is web-only
      <View style={{ flex: 1, backgroundColor: '#ECEFF1', alignItems: 'center', justifyContent: 'center', padding: 10, touchAction: 'auto' }}>
        <View style={{
          width: '100%', maxWidth: 400, height: '92vh', maxHeight: 850,
          backgroundColor: '#FFF', borderRadius: 45, overflow: 'hidden', borderWidth: 10, borderColor: '#1A1A1A', boxShadow: '0px 20px 40px rgba(0,0,0,0.1)', position: 'relative'
        }}>
          <View style={{ position: 'absolute', top: 5, left: '50%', transform: [{ translateX: -60 }], width: 120, height: 25, backgroundColor: '#1A1A1A', borderRadius: 20, zIndex: 100 }} />
          {activeContent}
        </View>
      </View>
    );
  }

  return activeContent;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#1A1A1A' },
  cartIcon: { padding: 8, backgroundColor: '#FFF', borderRadius: 50, elevation: 2, position: 'relative' },
  cartBadge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#FF3B30', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  cartBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  banner: { margin: 20, backgroundColor: '#1A1A1A', borderRadius: 24, padding: 30, minHeight: 180, justifyContent: 'center' },
  bannerTitle: { color: '#FFF', fontSize: 28, fontWeight: '800', marginBottom: 15 },
  bannerButton: { backgroundColor: '#007AFF', alignSelf: 'flex-start', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 100 },
  bannerButtonText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 20, marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A1A' },
  sectionSubtitle: { fontSize: 14, color: '#007AFF', fontWeight: '600' },
  listContainer: { paddingHorizontal: 10 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginBottom: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 15,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: { height: 220, width: '100%', backgroundColor: '#F0F0F0', position: 'relative' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  badge: { position: 'absolute', top: 15, left: 15, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '800', color: '#1A1A1A' },
  infoContainer: { padding: 15, position: 'relative' },
  productName: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 5 },
  productPrice: { fontSize: 16, fontWeight: '800', color: '#007AFF' },
  addButton: { position: 'absolute', right: 15, bottom: 15, backgroundColor: '#1A1A1A', width: 35, height: 35, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  addButtonText: { color: '#FFF', fontSize: 20 },
  detailsImageWrapper: { width: '100%', height: 400, backgroundColor: '#F0F0F0', position: 'relative' },
  detailsImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  backButton: { position: 'absolute', top: 30, left: 20, backgroundColor: 'rgba(255,255,255,0.85)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  backButtonText: { fontWeight: '700', color: '#1A1A1A' },
  detailsContentWrapper: { padding: 24, backgroundColor: '#FFF', borderTopLeftRadius: 35, borderTopRightRadius: 35, marginTop: -35, minHeight: 400 },
  detailsTitle: { fontSize: 26, fontWeight: '900', color: '#1A1A1A' },
  detailsPrice: { fontSize: 26, fontWeight: '800', color: '#007AFF' },
  bottomBar: { padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#EFEFEF' },
  addToCartSpecialButton: { backgroundColor: '#1A1A1A', width: '100%', paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  addToCartSpecialText: { color: '#FFF', fontSize: 18, fontWeight: '700' }
});
