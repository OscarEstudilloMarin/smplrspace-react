import { Link } from "react-router-dom";

const Index = () => {
  const ButtonContainer = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
  };

  const FullScreen = {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div style={FullScreen}>
      <h1>INDEX</h1>

      <div style={ButtonContainer}>
        <Link to='/hello-world'>
          <button>HELLO WORLD</button>
        </Link>
        <Link to='/custom-test'>
          <button>CUSTOM TEST</button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
