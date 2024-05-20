import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext.js";
import gifcinepals from "../../img/gifcinepals.gif";
import "../../styles/home.css";
import { BoxArrowInRight, StarFill, ShareFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

export const Home = () => {
 
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getMoviesLanding();
  }, []);

  const lastMovies = store.latestMovies;

  return (
    <div className="container text-center">
    <div className="row">
      <div className="col mt-4 mb-4">
        <h1>Comparte tus pelis y series</h1>
        <h5>
          Crea tus listas de películas y series favoritas e invita a tus amigos para que puedan compartir contigo las suyas.
        </h5>
        <button className="btn btn-primary mt-4">Unirme</button>
      </div>
      <div className="col mt-4 mb-4">
        <img width="450px" src={gifcinepals} alt="Cinepals" />
      </div>
      <h2 className="mt-4">¿Cómo funciona CinePals?</h2>
      <div className="container mt-3 mb-4">
        <div className="row">
          <div className="col-sm">
            <p><BoxArrowInRight size={40} /></p>
            <h4>Únete y busca todas tus pelis y series favoritas</h4>
          </div>
          <div className="col-sm">
            <p><StarFill size={40} /></p>
            <h4>Crea tus listas, puedes crear todas las que quieras</h4>
          </div>
          <div className="col-sm">
            <p><ShareFill size={40} /></p>
            <h4>Comparte tu lista para que puedan añadir más pelis y series</h4>
          </div>
        </div>
      </div>
      <h2 className="mt-4">Todas tus series y pelis, en un solo lugar</h2>
    </div>
    <div className="d-flex flex-wrap justify-content-center">
      {lastMovies.slice(0, 5).map((item, index) => {
        return (
          <Link to={`/movie/${item.id}`} key={index} className="m-2">
            <div className="card" style={{ width: '12rem' }}>
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                className="card-img-top"
                alt={item.title}
              />
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  </div>
);
};
