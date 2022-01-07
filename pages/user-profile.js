function UserProfilePage(props) {
  // nie można prerenderować, bo trzeba wiedziec dla jakiego użytkownika to renderujemy
  //dynamiczne dane [userID].js nie rozwiazuje problemu bo kazdy kto wpisze id w url będzie widziec dane dla tego użytkownika
  // zamiast tego chcemcy zidentyfikować usera który robi request np wysyła cookie - potrzebny obiekt request który ma headery, cookies etx
  // i dowiedziec sie ktory user robił request - typowy problem kozwiazywany przez getServerSideprops
  return <h1>{props.username}</h1>;
}

export default UserProfilePage;

/************* SERVER SIDE RENDERING *************/
// uruchamiane for every incoming request
export async function getServerSideProps(context) { //tylko na serwerze na żywo działa
    //nie trzeba pracować z req i res ale należy wybrać  getServerSideProps jeśli chce sie miec pewnosć że to działa dla kazego przychodzącego żadania
    //nigdy nie jest statycznie prerenderowane; np przydatne gdy mamy hihly dynamic data które zmieniaja się wiele razy w ciagu 1s
    //wiec wtedy każda serwowana strona byłaby outdated

    //kluczowa róznica, to że są dodatkowe dane z context: res, req and the timing on this function

    //można nawac w zrotce dac dodatkowe headery jak sie chce
    const {params, req, res} = context; //params tak samo jak w getStaticProps ale są dodakowe rzeczy <3
    //res nie trzeba sie przejmować bo nextjs zwróci komponent, ale można manipulować response
    //req reach the server headers, cookie
    //req i res sa defaultowe Nodejs obiekty
    console.log(req); //do autentykacji potrzebne
    console.log(res);

  // zwrotka - obiekt taka sama struktura jak getStaticProps - ma props, i moze mieć klucze redirect, notFound

  return {
    props: {
      //props dostepne w komponencie
      username: "Max",
    },
  };
}
