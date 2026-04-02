import { Injectable } from '@nestjs/common';

const MOCK_PRODUCTS = [
  { id: '1', name: 'MacBook Pro M3', price: '$1299', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80', tag: 'NUEVO', desc: 'La laptop más avanzada de Apple para profesionales creativos. Equipada con el chip M3.', priceValue: 1299 },
  { id: '2', name: 'iPhone 15 Pro', price: '$999', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80', tag: 'POPULAR', desc: 'El primer iPhone diseñado con titanio de calidad aeroespacial. Incluye el revolucionario chip A17 Pro.', priceValue: 999 },
  { id: '3', name: 'AirPods Max', price: '$549', image: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=500&q=80', tag: '', desc: 'Cancelación activa de ruido líder en la industria y audio espacial inmersivo de Apple.', priceValue: 549 },
  { id: '4', name: 'Apple Watch Ultra', price: '$799', image: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=500&q=80', tag: 'OFERTA', desc: 'El Apple Watch más resistente e intuitivo. Diseñado para la exploración y la aventura.', priceValue: 799 },
];

@Injectable()
export class AppService {
  getProducts() {
    return MOCK_PRODUCTS;
  }
}
