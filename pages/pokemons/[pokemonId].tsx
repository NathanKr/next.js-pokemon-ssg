import styles from "../../styles/PokemonDetails.module.css";
import { GetStaticPaths, GetStaticProps } from "next";
import { URL_POKEMONS_JSON } from "../../utils/constants";
import IPokemon from "../../types/IPokemon";

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

interface IPath {
  params: { pokemonId: string };
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { pokemonId } = context.params as any;
  let pokemonDetails: IPokemonDetails | undefined = undefined;

  if (pokemonId) {
    const url = `https://jherr-pokemon.s3.us-west-1.amazonaws.com/pokemon/${pokemonId}.json`;
    const response = await fetch(url);
    pokemonDetails = await response.json();
  }

  return {
    // props will be passed to the page component as props
    props: { pokemonDetails },
  };
};



async function getParams(): Promise<IPath[]> {
  const response = await fetch(URL_POKEMONS_JSON);
  const pokemons: IPokemon[] = await response.json();

  return pokemons.map((it) => {
    return { params: { pokemonId: `${it.id}` } };
  });
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  return {
    paths: await getParams(),
    fallback: false, // false or 'blocking'
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
    <>
      <h2>
        This pokemon details are fetched using SSG function getStaticProps
      </h2>
      <h4>
        thus <span style={{ color: "red" }}>html document</span> is downloaded
        to the client
      </h4>
      <div className={styles.PokemonDetails}>
        <img src={imgUrl} alt="image" />
        <div>
          <h3>{pokemonDetails.name}</h3>
          <p>{pokemonDetails.type}</p>
          {tableElem}
        </div>
      </div>
    </>
  );
};

export default PokemonDetails;
