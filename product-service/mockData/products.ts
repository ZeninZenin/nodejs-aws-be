import { Product } from '../types';

export const PRODUCTS_MOCK: Product[] = [
  {
    name: 'Green Lightsaber',
    price: 75000,
    imgUrl: 'https://images-na.ssl-images-amazon.com/images/I/41YsZiuMvrL._AC_SX425_.jpg',
  },
  {
    name: 'Red Lightsaber',
    price: 85000,
    imgUrl: 'https://images-na.ssl-images-amazon.com/images/I/41rvYpkxkuL._AC_SL1000_.jpg',
  },
  {
    name: 'Cyan Lightsaber',
    price: 95000,
    imgUrl: 'https://cdn-ssl.s7.disneystore.com/is/image/DisneyShopping/7512057372002',
  },
  {
    name: 'Blue Lightsaber',
    price: 75000,
    imgUrl: 'https://images-na.ssl-images-amazon.com/images/I/41506V73oML._AC_SX466_.jpg',
  },
  {
    name: 'Golden Lightsaber',
    price: 70000,
    imgUrl: 'https://i.pinimg.com/originals/cb/5d/a8/cb5da864671c6b722182c603c43f0620.jpg',
  },
  {
    name: 'Double Red Lightsaber',
    price: 130000,
    imgUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQFw4Osb5esGdsKEaLzO96nO0WEZ6k25oVpdw&usqp=CAU',
  },
  {
    name: 'Super Collection',
    price: 300000,
    imgUrl: 'https://static.standard.co.uk/s3fs-public/thumbnails/image/2020/05/04/09/fortnite-lightsabers.jpg',
  },
  {
    name: 'Kylo Ren Lightsaber',
    price: 150000,
    imgUrl:
      'https://cdn.vox-cdn.com/thumbor/RyFrVbXZfCpR86sosNp4z_VS6DM=/378x0:1665x858/1400x1400/filters:focal(378x0:1665x858):format(jpeg)/cdn.vox-cdn.com/uploads/chorus_image/image/44245664/mysterious_lightsaber_official_shot.0.0.jpg',
  },
].map((product, i) => ({ ...product, id: `${i}` }));
