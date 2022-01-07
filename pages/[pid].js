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
      //   powiedzmy, że te strony ponizej są rzadko oglądane wiec ich nie prerenderuję
      //   { params: { pid: "p2" } },
      //   { params: { pid: "p3" } },
    ],
    // fallback: true, //pomaga gdy jest wieele stron do prerenderowania; jak się ma jak amazon milion produktów to może się okazać
    // że prerenderowanie tak wielu produktów moż nie być wcale obtymalne; ale prerenderowanie miliona stron moze zajac baaardzo długo
    // mogą byc produkty ktore są rzadko używane/albo wpisy na blogu które są nigdy nie przeczytane; prerenderowanie takich stron jest stratą czasu i zasobów
    // tutj [fallback] jest przydatne, np fallback: true mówi o prerenderowanie tylko niektórych stron, a o reszczie gdy jest true 
    // to mówimy że mają być renderowanie na żadanie odwiedzenia, nie sa to strony prerenderowane ale wyrenderowane w momencie kiedy request idzie do serwera
    //ale jak ktoś wpisze w urla http://localhost:3000/p3 a  nie się przeklika to trzeba być przygotowanym na fallback z komponentu reacta
    //  TypeError: Cannot read property 'title' of undefined

    // alternatywa dla fallback: true,
    fallback: 'blocking', //nextja teraz czeka aż strona będzie w pełni prerenderowana na serwerze before is serwe that
    // trochę dłuzej dla usera ale odpowiedź będzie wysłana
  };
}

export default ProductDetailPage;
