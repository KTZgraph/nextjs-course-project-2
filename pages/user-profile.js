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
export async function getServerSideProps(context) {
  // zwrotka - obiekt taka sama struktura jak getStaticProps - ma props, i moze mieć klucze redirect, notFound
  return {
    props: {
      //props dostepne w komponencie
      username: "Max",
    },
  };
}
