import React, { useState, useMemo, useEffect } from "react";
import TinderCard from "../react-tinder-card/index";
//import TinderCard from "react-tinder-card";

const db = [
  {
    name: "Richard Hendricks",
    url: "./img/richard.jpg",
  },
  {
    name: "Erlich Bachman",
    url: "./img/erlich.jpg",
  },
  {
    name: "Monica Hall",
    url: "./img/monica.jpg",
  },
  {
    name: "Jared Dunn",
    url: "./img/jared.jpg",
  },
  {
    name: "Dinesh Chugtai",
    url: "./img/dinesh.jpg",
  },
];

const alreadyRemoved = [];
let charactersState = db; // This fixes issues with updating characters state forcing it to use the current state and not the state that was active when the card was created.
let lastDirectionHistory = [];

function Advanced() {
  const [characters, setCharacters] = useState(db);
  const [lastDirection, setLastDirection] = useState();
  const [nameToRestore, setNameToRestore] = useState();

  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );

  useEffect(() => {
    if (nameToRestore) {
      const index = db.map((person) => person.name).indexOf(nameToRestore);
      console.log("index", index);
      console.log("childRefs", childRefs[index].current);
      childRefs[index].current.restoreCard("right");
      console.log("restored", nameToRestore);
      setNameToRestore(null);
    }
  }, [childRefs, nameToRestore]);

  const swiped = (direction, nameToDelete) => {
    console.log("removing: " + nameToDelete);
    lastDirectionHistory.push(lastDirection);
    setLastDirection(direction);
    if (!alreadyRemoved.includes(nameToDelete)) {
      //don't replicate names in alreadyRemoved
      alreadyRemoved.push(nameToDelete);
    }
  };

  const outOfFrame = (name) => {
    console.log(name + " left the screen!");
    charactersState = charactersState.filter(
      (character) => character.name !== name
    );
    setCharacters(charactersState);
  };

  const swipe = (dir) => {
    const cardsLeft = characters.filter(
      (person) => !alreadyRemoved.includes(person.name)
    );
    if (cardsLeft.length) {
      const toBeRemoved = cardsLeft[cardsLeft.length - 1].name; // Find the card object to be removed
      const index = db.map((person) => person.name).indexOf(toBeRemoved); // Find the index of which to make the reference to
      if (!alreadyRemoved.includes(toBeRemoved)) {
        //don't replicate names in alreadyRemoved
        alreadyRemoved.push(toBeRemoved); // Make sure the next card gets removed next time if this card do not have time to exit the screen
      }
      childRefs[index].current.swipe(dir); // Swipe the card!
    }
  };

  const goBack = () => {
    console.log(alreadyRemoved);
    if (alreadyRemoved.length > 0) {
      const nameToRestore = alreadyRemoved.pop();
      charactersState.push(db.find((person) => person.name === nameToRestore));
      setCharacters(charactersState);
      setLastDirection(lastDirectionHistory.pop());
      setNameToRestore(nameToRestore); //remember to restore when ref will be available
    }
  };

  return (
    <div>
      <link
        href="https://fonts.googleapis.com/css?family=Damion&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Alatsi&display=swap"
        rel="stylesheet"
      />
      <h1>React Tinder Card</h1>
      <div className="cardContainer">
        {characters.map((character, index) => (
          <TinderCard
            ref={childRefs[index]}
            className="swipe"
            key={character.name}
            onSwipe={(dir) => swiped(dir, character.name)}
            onCardLeftScreen={() => outOfFrame(character.name)}
          >
            <div
              style={{ backgroundImage: "url(" + character.url + ")" }}
              className="card"
            >
              <h3>{character.name}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
      <div className="buttons">
        <button onClick={() => swipe("left")}>Swipe left!</button>
        <button onClick={() => swipe("right")}>Swipe right!</button>
      </div>
      {
        <div className="buttons">
          <button
            disabled={characters.length >= db.length}
            onClick={() => goBack()}
          >
            Go Back!
          </button>
        </div>
      }
      {lastDirection ? (
        <h2 key={lastDirection} className="infoText">
          You swiped {lastDirection}
        </h2>
      ) : (
        <h2 className="infoText">
          Swipe a card or press a button to get started!
        </h2>
      )}
    </div>
  );
}

export default Advanced;
