import path from "path";
import fs from "fs/promises"; //filesystem module z Nodejs wbudowana bilbioteka

function HomePage(props) {
  // props jest przygotowane przez getStaticProps
  const { products } = props;

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.title}</li>
      ))}
    </ul>
  );
}

// prefetch data before we create component. before component is created by nextjs
export async function getStaticProps() {
  //tylko gdy [npm run build] ale on nie działa na serwerze naprawdę
  // WADA PRZESTARZAŁYCH DANYCH gdy mam dane, które się zmieniają ciągle, trzeba ciągle rebuild i redeploy
  //INCREMENTAL STATIC GENERATION ciągle renderowanie co iles sekund [ZNACZENIE NA PRODUKCJI]
  //sama nazwa mówi - przygotowuje propsy dla twojego komponentu
  // musi zwocić obiekt który ma props atrybut

  console.log('(RE-)Generating...');

  // uwaga na ściezki! jak Nectjs uruchamia pliki, to tak jalby wszystkie były w folderze root głównym, a nie /pages jak tutuaj
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json"); //process.cwd current working director globalnie dostepny obiekt - sciezka od której zaczynamy
  const jsonData = await fs.readFile(filePath); // asycn zwraca promise
  const data = JSON.parse(jsonData);

  return {
    props: {
      products: data.products,
    },
    // INCREMENTAL STATIC GENERATION
    revalidate: 10, // co 10 sekund; ale serwerze developerskim zawsze się uruhamia, ZNACZENIE NA PRODUKCJI
  };
}

export default HomePage;
