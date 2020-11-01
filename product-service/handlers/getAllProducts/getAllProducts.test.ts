import { APIGatewayProxyResult } from 'aws-lambda';
import { getAllProducts } from './getAllProducts.handler';

test('Returns a products list', async () => {
  const res = await getAllProducts(null, null, null);
  expect((res as APIGatewayProxyResult).body).toBe(
    '[{"name":"Green Lightsaber","price":948.8906625,"imgUrl":"https://images-na.ssl-images-amazon.com/images/I/41YsZiuMvrL._AC_SX425_.jpg","id":"0"},{"name":"Red Lightsaber","price":1075.4094175,"imgUrl":"https://images-na.ssl-images-amazon.com/images/I/41rvYpkxkuL._AC_SL1000_.jpg","id":"1"},{"name":"Cyan Lightsaber","price":1201.9281725,"imgUrl":"https://cdn-ssl.s7.disneystore.com/is/image/DisneyShopping/7512057372002","id":"2"},{"name":"Blue Lightsaber","price":948.8906625,"imgUrl":"https://images-na.ssl-images-amazon.com/images/I/41506V73oML._AC_SX466_.jpg","id":"3"},{"name":"Golden Lightsaber","price":885.6312849999999,"imgUrl":"https://i.pinimg.com/originals/cb/5d/a8/cb5da864671c6b722182c603c43f0620.jpg","id":"4"},{"name":"Double Red Lightsaber","price":1644.743815,"imgUrl":"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQFw4Osb5esGdsKEaLzO96nO0WEZ6k25oVpdw&usqp=CAU","id":"5"},{"name":"Super Collection","price":3795.56265,"imgUrl":"https://static.standard.co.uk/s3fs-public/thumbnails/image/2020/05/04/09/fortnite-lightsabers.jpg","id":"6"},{"name":"Kylo Ren Lightsaber","price":1897.781325,"imgUrl":"https://cdn.vox-cdn.com/thumbor/RyFrVbXZfCpR86sosNp4z_VS6DM=/378x0:1665x858/1400x1400/filters:focal(378x0:1665x858):format(jpeg)/cdn.vox-cdn.com/uploads/chorus_image/image/44245664/mysterious_lightsaber_official_shot.0.0.jpg","id":"7"}]',
  );
});
