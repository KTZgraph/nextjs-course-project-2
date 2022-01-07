// mamy stronę dla każdego użytkownika po id
//nie mozemy tutaj użyć getStaticProps

function UserIdPage(props) {
  return <h1>{props.id}</h1>;
}

export default UserIdPage;

export async function getServerSideProps(context) {
  //nie wymaga getStaticPaths
  //działa po stronie serwera, wiec nextjs nie prerenderuje żadnej strony, wiec ni emusi znac instancji dla jakich to generuje 

  const { params } = context;
  const userId = params.uid; // klucz jak nazwa pliku [uid].js
  return {
    props: {
      id: "userid-" + userId,
    },
  };
}
