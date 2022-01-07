import path from "path";
import fs from "fs/promises"; //filesystem module z Nodejs wbudowana bilbioteka
import { Fragment } from "react";

function ProductDetailPage(props) {
  // destruktuzryzacja
  const { loadedProduct } = props;

  // fallback: true sprawdzenie danych czy na pewno nje tutuaj mamy ale dla [fallback: 'blocking',] ten kod NIE POTRZEBNY
  if (!loadedProduct) {
    //react sam zacviąga dane
    // MUSI BYC JAK fallback:true
    // teraz sobie zaciąga dane - user widzi chwilke opóźnienia ale przynajmnie nie błąd!
    // trochę podobne do standardowego reactowego useEffect,s setState
    return <p>Loading...</p>;
  }

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


/*************************** STATIC GENERATION [npm run build] i [revalidated ***************************/
//STATIC GENERATION nawet z sekundowym odświeżaneime - poniższe funkcje nie maja to actual request becausse that functions are not called for the actual request
// at least not only; with incremental static generation sa wywołowane z incoming request at leas sometimes if they need to be revalidated
// generalnie są wywoływane gdy projekt jest budowany 
//czyli nie ma własciwego dostępu do nadchodzących requestów, czesto takie dostepu nie trzbea np tutaj dla pojedycznego produktu
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

  //   Unhandled Runtime Error
  // Error: Failed to load static props
  // bo komponent nie ma props jak nie znaleziono danych dla nieistniejacego id, wiec nawet sprawdzenie w komponencie i loading... nie pomoże
  if (!product) { //żeby 404 error page
    // walidacja danych gdy produktu nie znaleziono
    return { notFound: true }; //dizęki temu można użyć fallback:tru i dalej próbować znaleźc nie prerendering pages
  }

  return {
    props: {
      loadedProduct: product, // dane do propsów komponentu
    },
  };
}

export async function getStaticPaths() { //współracuje z getStaticProps wymaga dla wszsytkich dynamiczny [jakiesId].js plików
  const data = await getData();

  const ids = data.products.map((product) => product.id); // tylko lista z idkami
  const pathsWithParams = ids.map((id) => ({ params: { pid: id } })); //zmapowanie, zeby to był alista obiektów jak paths wymaga

  //informacja ile konkretnie stron ma pregenerated
  return {
    paths: pathsWithParams, //wszystkie strony są pregenerowane
    fallback: true, //nawet jeśli idvalue nie jest w liscie, to może ona stnieć
  };
}

export default ProductDetailPage;
