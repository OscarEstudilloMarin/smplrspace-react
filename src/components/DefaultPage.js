import React from "react";
import BackButton from "./BackButton";
class DefaultPage extends React.Component {
  render() {
    const FullScreen = {
      height: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    };
    return (
      <>
        <main style={FullScreen}>
          <BackButton />
          {this.props.children}
        </main>
      </>
    );
  }
}
export default DefaultPage;
