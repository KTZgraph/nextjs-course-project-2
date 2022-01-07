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
  //sama nazwa mówi - przygotowuje propsy dla twojego komponentu
  // musi zwocić obiekt który ma props atrybut
  return {
    props: {
      products: [{ id: "p1", title: "Product 1" }], //też musi być obiektem
    },
  };
}

export default HomePage;
