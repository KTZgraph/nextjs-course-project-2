import path from "path";
import fs from "fs/promises"; //filesystem module z Nodejs wbudowana bilbioteka
import { Fragment } from "react";

function ProductDetailPage(props) {
  // destruktuzryzacja
  const { loadedProduct } = props;

  return (
    <Fragment>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </Fragment>
  );
}

export async function getStaticProps(context) {
  // tutaj ważny parametr context
  // pobieranie informacji o jdenym produkcie
  const { params } = context; //params to atrubt obiektu context, .params ma key-value dane
  // ogólnie pid można by użyć mechanizu reacta  useRouter().quesry.nazwaIDjakZPliku - ale to się dizeje tylko w przeglądsrce
  // różnica jest taka że jak się używa predenerowania to się uruchamia na serwerze przed uruchomienie koponentu
  //jak się planuje na prerenderowanie danych przez komponentem to trzeba context.params

  const productId = params.pid; // jak z nazwy pliku

  //kopia z pages/index.js
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json"); //process.cwd current working director globalnie dostepny obiekt - sciezka od której zaczynamy
  const jsonData = await fs.readFile(filePath); // asycn zwraca promise
  const data = JSON.parse(jsonData);
  // filtrowanie żeby dostać konkrenty produkt
  const product = data.products.find((product) => product.id === productId);

  return {
    props: {
      loadedProduct: product, // dane do propsów komponentu
    },
  };
}

export async function getStaticPaths() {
  //informacja ile konkretnie stron ma pregenerated
  return {
    //zwraca obiekt z atrybutem paths którego wartością jest lista boiektów
    paths: [
      //getStaticProps będzie uruchominiona tyle razy ile jest różnych obiektów
      //konkretnei które instancje stron mają być wcześniej wyrenderowane
      { params: { pid: "p1" } },
      { params: { pid: "p2" } },
      { params: { pid: "p3" } },
    ],
    fallback: false,
  };
}

export default ProductDetailPage;
