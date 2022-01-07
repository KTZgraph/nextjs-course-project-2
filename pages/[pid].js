import path from "path";
import fs from "fs/promises"; //filesystem module z Nodejs wbudowana bilbioteka
import { Fragment } from "react";

function ProductDetailPage(props) {
  // destruktuzryzacja
  const { loadedProduct } = props;

  //   fallback: true sprawdzenie danych czy na pewno nje tutuaj mamy ale dla [fallback: 'blocking',] ten kod NIE POTRZEBNY
  // if(!loadedProduct){ //react sam zacviąga dane
  //     // teraz sobie zaciąga dane - user widzi chwilke opóźnienia ale przynajmnie nie błąd!
  //     // trochę podobne do standardowego reactowego useEffect,s setState
  //     return <p>Loading...</p>
  // }

  return (
    <Fragment>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </Fragment>
  );
}

async function getData() {
  //funckja do pobierania danych osobno żeby nie kopiować kodu

  const filePath = path.join(process.cwd(), "data", "dummy-backend.json"); //process.cwd current working director globalnie dostepny obiekt - sciezka od której zaczynamy
  const jsonData = await fs.readFile(filePath); // asycn zwraca promise
  const data = JSON.parse(jsonData);
  return data;
}

export async function getStaticProps(context) {
  // tutaj ważny parametr context
  // pobieranie informacji o jdenym produkcie
  const { params } = context; //params to atrubt obiektu context, .params ma key-value dane
  // ogólnie pid można by użyć mechanizu reacta  useRouter().quesry.nazwaIDjakZPliku - ale to się dizeje tylko w przeglądsrce
  // różnica jest taka że jak się używa predenerowania to się uruchamia na serwerze przed uruchomienie koponentu
  //jak się planuje na prerenderowanie danych przez komponentem to trzeba context.params

  const productId = params.pid; // jak z nazwy pliku

  const data = await getData();
  // filtrowanie żeby dostać konkrenty produkt
  const product = data.products.find((product) => product.id === productId);

  return {
    props: {
      loadedProduct: product, // dane do propsów komponentu
    },
  };
}


export async function getStaticPaths() {
  const data = await getData();

  const ids = data.products.map(product => product.id); // tylko lista z idkami
  
  const pathsWithParams = ids.map(id => ({params: {pid: id}})) //zmapowanie, zeby to był alista obiektów jak paths wymaga

  //informacja ile konkretnie stron ma pregenerated
  return {
    paths: pathsWithParams,
    // alternatywa dla fallback: true,
    fallback: "blocking",
  };
}

export default ProductDetailPage;
