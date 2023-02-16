const BackButton = () => {
  const positionLeftCorner = {
    position: "absolute",
    top: 10,
    left: 5,
  };
  return (
    // eslint-disable-next-line no-restricted-globals
    <button style={positionLeftCorner} onClick={() => history.go(-1)}>
      BACK
    </button>
  );
};

export default BackButton;
