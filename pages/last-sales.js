//client side data feticnhg
// np koszyk klienta
// cześć danych jest zjakiś innych danych w np. dashboardzie i szybszy dostep do strony iniż załadowanie wszystkich danych jest ważniejszy
// dane z api sie strasznie syzbko zmieniają np wizualizacja giełdy
//DANE tutuaj pobrane NIE SA widoczne w źródle strony!

import { useEffect, useState } from "react";
import useSWR from "swr";

/************************ pobieranie danych po stronie klienta *************************** */
function LastSalesPage() {
  const [sales, setSales] = useState(); //domyslnie undefined bo nie mamy żadnych sprzedaży
  //   const [isLoading, setIsLoading] = useState(false); //spinner jak czekamy na dane

  const { data, error } = useSWR(
    "https://nextjs-course-28060-default-rtdb.firebaseio.com/sales.json"
  ); //drugi rgument to defaulotoo fetch wbudowany

  //teraz useEffect tylko żeby zmienić dane z firebasa(obiekt) na listę

  useEffect(() => {
    if (data) {
      console.log("TUUUUUUUUUUUUUUUUUU");
      //jesli mamy dane
      const transformedSales = [];
      //pętlą buduję Array
      for (const key in data) {
        transformedSales.push({
          id: key,
          username: data[key].username,
          volume: data[key].volume,
        });
      }
      console.log(transformedSales);
      setSales(transformedSales);
    }
  }, [data]);

  //typowo Reactowe wysyłanie requesta
  //   useEffect(() => { //wykona się dopiero po wyrenderowanie JSX to mogą być błedy w komponencie że nie ma danych
  //     setIsLoading(true); // na poczaotku gdy zaczynamy pobierac dane
  //     // połaczenie z firebasem testowo, fetch zwraca promise
  //     fetch("https://nextjs-course-28060-default-rtdb.firebaseio.com/sales.json") //jako dummy backend
  //       .then((response) => response.json()) //znowu zwraca promise
  //       .then((data) => {
  //         //tutaj już włąsciwe dane
  //         //z firebase dostanę obiekt, wiec musze go na listę zmienić
  //         const transformedSales = [];
  //         //pętlą buduję Array
  //         for (const key in data) {
  //           transformedSales.push({
  //             id: key,
  //             username: data[key].username,
  //             volume: data[key].volume,
  //           });
  //         }

  //         setSales(transformedSales); //akualizacja danych, zeby wyświetlić je w komponencie
  //         setIsLoading(false); //bo juz dane załadowane to spinner nie potrzebny
  //       });
  //   }, []);

  //   if (isLoading) {
  //     //spinner
  //     return <p> Loading ...</p>;
  //   }

  if (error) {
    //error ważniejszy niż loading state dlatego pierwszy
    return <p>Failed to load</p>; //initial state of the page i to jest prerenderowane przez nextjs ale bez danych, bo dane są pobrane po stronie klienta
  }

  if (!data || !sales) {
    //spinner gdy nie ma danych, albo się jeszcze nie przetrasformowały w listę
    return <p> Loading ...</p>;
  }

  //   if(!sales){
  //       return <p>No data yet...</p> //initial state of the page i to jest prerenderowane przez nextjs ale bez danych, bo dane są pobrane po stronie klienta
  //   }

  return (
    <ul>
      {sales.map((sale) => (
        <li key={sale.id}>
          {sale.username} - ${sale.volume}
        </li>
      ))}
    </ul>
  );
}

// mieszanie żey prerender jakiś widok
export async function getStaticProps() {
  //nie można użyć tutja webHooków - trzeba standarodowo fetcha napisać
  //   fetch trzeba zwrócić; alternatywnie można użyć await
//   const response = await fetch("https://nextjs-course-28060-default-rtdb.firebaseio.com/sales.json") 
//const data = await response.json()

  return fetch(
    "https://nextjs-course-28060-default-rtdb.firebaseio.com/sales.json"
  ) //jako dummy backend
    .then((response) => response.json()) //znowu zwraca promise
    .then((data) => {
      const transformedSales = [];

      //pętlą buduję Array
      for (const key in data) {
        transformedSales.push({
          id: key,
          username: data[key].username,
          volume: data[key].volume,
        });
      }

      //getStaticProps jest asynchroniczna i zwraca promisa, ale fetch też zwraca promisa to go tutaj zwracam
      return { props: { sales: transformedSales }, revalidate: 10 }; // odświeżanie co 10sekund po deploymencie
    });
}

export default LastSalesPage;
