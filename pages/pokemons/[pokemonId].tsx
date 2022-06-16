import styles from "../../styles/PokemonDetails.module.css";
import { GetServerSideProps } from "next";

interface IStat {
  name: string;
  value: number;
}

interface IPokemonDetails {
  name: string;
  type: string[];
  stats: IStat[];
  image: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { pokemonId } = context.params as any;
  let jsonPokemonDetails;

  if (pokemonId) {
    const url = `https://jherr-pokemon.s3.us-west-1.amazonaws.com/pokemon/${pokemonId}.json`;
    const response = await fetch(url);
    jsonPokemonDetails = await response.json();
  }

  return {
    // props will be passed to the page component as props
    props: { pokemonDetails: jsonPokemonDetails },
  };
};

const PokemonDetails = (props: { pokemonDetails: IPokemonDetails }) => {
  const { pokemonDetails } = props;

  if (!pokemonDetails) {
    return <div>Details are undefined ........</div>;
  }

  const statsElem = pokemonDetails.stats.map((it, i) => (
    <tr key={i}>
      <td>{it.name}</td>
      <td>{it.value}</td>
    </tr>
  ));
  const tableElem = (
    <table>
      <tr>
        <th>Name</th>
        <th>Value</th>
      </tr>
      {statsElem}
    </table>
  );
  const imgUrl = `/${pokemonDetails.image}`;
  return (
    <div>
      <h2>
        This pokemon details are fetched using SSR function getServerSideProps
      </h2>
      <h4>thus <span style={{color:'red'}}>html document</span> is downloaded to the client</h4>
      <div className={styles.PokemonDetails}>
        <img src={imgUrl} alt="image" />
        <div>
          <h3>{pokemonDetails.name}</h3>
          <p>{pokemonDetails.type}</p>
          {tableElem}
        </div>
      </div>
    </div>
  );
};

export default PokemonDetails;
