import { useNavigate } from "react-router-dom";


const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      userInfo:{},
      nombreUsuario: {},
      name: "",
      userId: "",
      token: "",
      lista: {},
      listas: [],
      series: [], 
      serie: [],
      latestMovies: [],
      allInfo: [],
      movie: [],
      pelis: []
    },
    actions: {
      
      /* REGISTRO */
      getCrearUsuario: async (email, password) => {
        const myHeaders = new Headers();
        myHeaders.append(
          "Cookie",
          ".Tunnels.Relay.WebForwarding.Cookies=CfDJ8E0FHi1JCVNKrny-ARCYWxO30RoRPnzCyE2EvGPJ2_lFViz1YIAA-jEUGdcdelZBYTQFl53QaWCjaNhnc2kzjFZIutFf5dUAAWGas4QGqMYkD6-wtQAAHE-IPzWo7LDgT1Ea-RmCRJdbdxk_RdNt2gPZ66txhUxSwQ1fHqgIcKrd89ghUAXyX7WkcUFPLzG_cnv7lTaEKxks4QvxrspvZg1AE2i0QDzFit-umbebIcrlfLZe8r04ZvQ6hkZV8pX37qWVVq0szpedgLuqDzXy_Do9qRTSSdBd-OGc02pgmbH5lvNWumyipLPGw2ne3J8Q_21tzj6rng_EoSxiSIFZucLlZgT4BMX1Itcb97xfhUv19mHWH_T2bO3y8hfwEtA97-lzMdwKecrbR7JX94QLgeV8aSsiRfBkjEVYYjml51wJx3Mnst8kgzOBSWmSiqPb9Sk7zHh6bLnFfj_aNJmFEgc4Bc-O0E14rAxhDGpvx21iDc9vZ-bgFBsaGhe-7xEZQNLA8rvpxvcOY1Xg-NBXijVBYAmx9Y0WvA-L0w3FQPfHLJV3iNfr6pK6lwQyVz2YgRSYf3KmWcFqMo-nJC_FF757_XwlppbZyiIpXVYtWavlpNefyO4Hax3mxAMqDO32RSjdLCVnbXjqLplAUX2CvFf8Sy6rheHXgfgtVwPv-IH8s7lUtZZTkui3jtUWVDmuHrUlNzT7PHEs4-q3EwDehyjXQXbllqqKeXyzCjwq4rO56KBodCSgQ6Nyf3VLGy7p6SjjKFn2SN2I-doBCg0KAJ4PBLrbtMbhdwPbGBnehpoW93GQZY1BURjA4DR_6COupJZKv2vGRBZEyl05XtxY-4gNBqRWDpZVkDCFpwSgkDWwFdx7EciiP5YX_3N-JFucwDaTvWH3m9nSG63QQ200UDFy8jR89kUCDklNOR7QTa79UImovl1G9A0zdlAG9UAoAS7ROKCSZtYcRVVH2veqwdsakViRZ5sLkgRObMWc-lwn"
        );
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          email: email,
          password: password,
        });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        await fetch(
          `${process.env.BACKEND_URL}/api/signup`,
          requestOptions
        )
          .then((response) => response.json())
          .then((result) => console.log(result))
          .catch((error) => console.log("error", error));
      },

      /* LOGIN */

      getLogin: async (email, password) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        const raw = JSON.stringify({
            email: email,
            password: password,
        });
    
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };
    
        await fetch(
            `${process.env.BACKEND_URL}/api/login`,
            requestOptions
        )
        .then((response) => response.json())
        .then((result) => {
          const store = getStore()
            setStore({...store, token: result.access_token, userId: result.userId });
            console.log('result: ' + JSON.stringify(result));
            // Llamar a getTraerUsuario justo después de obtener el token y el userId
            getActions().getTraerUsuario(result.userId);
        })
        .catch((error) => console.log("error", error));
      },

      /* LOGOUT */

      getLogout: async (navigate, token) => {
        

        setStore({ token: "" });
        localStorage.clear();
        navigate("/");

      },

      setSession: (token,userId) => {
        const store = getStore()
        setStore({...store, token, userId})
      },

      /* Traer info usuario, sus listas, editar y eliminar */ 

      getTraerUsuario: async () => {
        const store = getStore();
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/users/${localStorage.getItem('userId')}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${store.token}`
                }
            });
    
            if (response.status !== 200) {
                throw new Error("Error al obtener el usuario");
            }
    
            const data = await response.json();
            setStore({...store, userInfo: data });
        } catch (error) {
            console.error("Error al obtener el usuario", error);
        }
      },

      getTraerTodasLasListas: async () => {
        const store = getStore();
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/lists/all/${localStorage.getItem('userId')}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${store.token}`
              },
            });
            if (response.status !== 200) {
                throw new Error("Error al obtener las listas");
            }
            const data = await response.json();
            setStore({ listas: data });

        } catch (error) {
            console.error("Error al obtener las listas", error);
        }   
      },

      getEditUser: async (editedProfile) => {
        const store = getStore();
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/users/${store.userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${store.token}`
                },
                body: JSON.stringify(editedProfile)
            });
            if (response.status !== 200) {
                throw new Error("Error al editar usuario");
            }
            const data = await response.json();
            setStore({ userInfo: data });
            getActions().getTraerUsuario();
          
        } catch (error) {
            console.error("Error al editar usuario", error);
        }
      },

      getDeleteUser: async (navigate) => {
        const store = getStore();
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/users/${store.userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${store.token}`
                }
            });
    
            if (response.status !== 200) {
                throw new Error("Error al eliminar usuario");
            }
    
            const data = await response.json(data);
            setStore({ token: "", userId: ""});
            navigate(`/`);
        } catch (error) {
            console.error("Error al eliminar el usuario", error);
        }
      },

    /* Crear, añadir participantes, editar y eliminar lista*/

      getCrearLista: async (name) => {
        const store = getStore();
        const token = store.token;
    
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);
    
        const raw = JSON.stringify({
            name: name
        });
    
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };
    
        fetch(`${process.env.BACKEND_URL}/api/lists`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
              setStore({ listas: [...store.listas, result] });
              getActions().getTraerTodasLasListas();
            })
            .catch((error) => console.error(error));
      },

      getAñadirParticipante: async (id, email) => {
        const store = getStore();
        const token = store.token;
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);
        const raw = JSON.stringify({
            email: email
        });
        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };
        fetch(`${process.env.BACKEND_URL}/api/lists/${id}/add_user`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
              
                getActions().getTraerTodasLasListas();
            })
            .catch((error) => console.error(error));
      },
        
      getEditarLista: async (id, name) => {
        const store = getStore();
        const token = store.token;
        
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);
        const raw = JSON.stringify({
            name: name
        });
        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };
        fetch(`${process.env.BACKEND_URL}/api/lists/${id}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setStore({
                    listas: store.listas.map(lista => lista.id === id ? result.list : lista)
                });
                getActions().getTraerTodasLasListas();
            })
            .catch((error) => console.error(error));
        },

      getEliminarLista: async (id) => {
        const store = getStore();
        const token = store.token;
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/lists/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const updatedLists = store.listas.filter(lista => lista.id !== id);
            setStore({ listas: updatedLists });
            getActions().getTraerTodasLasListas();
            const data = await response.json();
          
        } catch (error) {
            console.error('Error deleting list:', error);
        }
      },

      /* ESTE TE TRAER EL NOMBRE DE LA LISTA */

      getTraerTitulo : async (id) => {
        const myHeaders = new Headers();
        myHeaders.append("Cookie", ".Tunnels.Relay.WebForwarding.Cookies=CfDJ8E0FHi1JCVNKrny-ARCYWxP7z1SIMXf07yfX787BPAhxukgyD3MYfMXC7R7A8Cw6FSW9H1bfykwAxOx9PUttUyEn3ITLYNOu6G-aape9TBM4cLNzLt4EnCW-e3ulkBkdwNEtSLjoFk1fk8keaf_tXs_PB7-ZgA0UtKgxK3lKM9-krBVIPdut6bbgbocB-qKvCMtgGgiYpwo7e1KbtSYEkIndRapjHZ4aP_j3sTzcNCmEJTPIKU7rZzaB2GKNQqF7pHHRcLSHBvEfxD1eI2K9NtTWhLderwvVnnMEgorl7IPbehVpF3zq7fBfN5s1CjMxnNX1YUMuSoo2lUlOteRw4Y1X-FdiHe9iPorhTwgUWCIvMIJ0fPHl0wUW4NNW6uzCzSRsy2qMWIyk3eOHQdJWx1Y2nBo6kL_33JhW12zd3wpdjMAEOy0D61dWRp_dh6QMKJEgiqMeouFU5OwFOUH3ZX8yf0ijY0GgZ57Bq8aE6V5A6AYVm3KaMFZUqJ8MGiAaQW1eMkgUcd_6bm6nuG7woAnsYkxlFADc1ClAGWiBjuMSwcUdFF8YezSLqWtC8RLopeWT52ujgkHNjYJbbX2OgfhjmxlGxMi7RaVH5rbR-lOJw4-WPUxo4QNAGPeJH-BzYEC-KQZIDIwWpmZ4wGM4Cdu6z7DNqRWNxIORWenwBnbwOhhs4qLFbW4zSH8u-JIXBdQZj59it8Dy3hlfRC-1n42KDEq5QU8se6MiJ9dYl19IXC7LXXj3r9kpcXTNdKsCMlfG3Z_Hq4IHc8ko2iEwCC-HchwtzItFFgVmiFJzgG-ElAz3RUOhtNmMa91Hpa4g78b6sKsiVXMMd_EVcl-TjB2_SXiAeyET_Ju-wAk3AnU9In0WeE-rn9K2zHUVieKncoDU5QyhnU_sVtzg1Y9moHOxrzCNW1bo1rYPrMJhCcwXP_C4fKIG7zYFsGOYmpsus_uKN9Wc32w2QNvZVJroxhevXwHCna6Ulh9O_YK5-T3yoYuV92na-i7ly7tfmjS6Gg");
        
        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        await fetch(
          `${process.env.BACKEND_URL}/api/lists/${id}`,
          requestOptions
        )
          .then((response) => response.json())
          .then((data) => setStore({ name: data.name }))
          
          .catch((error) => console.log("error", error));

      },

      /* ESTE ES EL GET DE LAS PELICULAS en las listas */

      getTraerPeliculas : async (list_id) => {
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
           
          }
        };
        
        fetch(`${process.env.BACKEND_URL}/api/lists/${list_id}`, options)
          .then(response => response.json())
          .then((data) => setStore ({pelis: data.movies}))
          .catch(err => console.error(err));
      },
      
      /* TRAE LAS SERIES en las listas*/

      getTraerSeries : async (id) => {
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
           
          }
        };
        
        fetch(`${process.env.BACKEND_URL}/api/lists/${id}`, options)
        .then(response => response.json())
        .then((data) => setStore ({series: data.series}))
        .catch(err => console.error(err));

      },

      /* eliminar pelicula o serie de la lista */

      getEliminarPelicula: async (list_id, id) => {
        
        const requestOptions = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ movie_id: id }),
          redirect: "follow",
        };
      
        await fetch(
          `${process.env.BACKEND_URL}/api/lists/${list_id}/remove`,
          requestOptions
        )
          .then((response) => {
            if (response.status === 200) {
              getActions().getTraerPeliculas(list_id);
            }
            return  response.json()})
          .then((data) => console.log(data))
          .catch((error) => console.log("error", error));
      },
      
      getEliminarSeries: async (list_id, id) => {
        
        const requestOptions = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ serie_id: id }),
          redirect: "follow",
        };
      
        await fetch(
          `${process.env.BACKEND_URL}/api/lists/${list_id}/remove`,
          requestOptions
        )
          .then((response) => {
            if (response.status === 200) {
              getActions().getTraerSeries(list_id);
            }
            return  response.json()})
          .then((data) => console.log(data))
          .catch((error) => console.log("error", error));
      },
      
      /* Trae películas recomendadas en el landing de la API */
      getMoviesLanding: async () => {
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MTUwZDQyNjQ2NGQxOGY0ZGRjMGM3ZWEwZjFjNTU2MyIsInN1YiI6IjY2NDI0ZTQ3M2MzMGM1ZjRhYzNhMWQ3ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1qYEcWtzCfR7JEiJLg5B4Nn9WdrFrwydfN68kLVNf-o'
          }
        };
        
        try {
          const response = await fetch('https://api.themoviedb.org/3/movie/now_playing?language=es-ES&page=1', options);
          const result = await response.json();
          setStore({ latestMovies: result.results });
        } catch (error) {
          console.error(error);
        }
      },

    // Busca pelis y series en la BBDD de la api
    
      getAllMoviesSeries: async (query) => {

        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MTUwZDQyNjQ2NGQxOGY0ZGRjMGM3ZWEwZjFjNTU2MyIsInN1YiI6IjY2NDI0ZTQ3M2MzMGM1ZjRhYzNhMWQ3ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1qYEcWtzCfR7JEiJLg5B4Nn9WdrFrwydfN68kLVNf-o'
          }
        };

        try {
          const response = await fetch(`https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=es-ES&page=1`, options);
          const result = await response.json();
          setStore({ allInfo: result.results });
          console.log(result);
        } catch (error) {
          console.error(error);
        }
      },


      // Vista detallada Peliculas y series GET y Añade a las listas //

      getMovie: async (id) => { 
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MTUwZDQyNjQ2NGQxOGY0ZGRjMGM3ZWEwZjFjNTU2MyIsInN1YiI6IjY2NDI0ZTQ3M2MzMGM1ZjRhYzNhMWQ3ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1qYEcWtzCfR7JEiJLg5B4Nn9WdrFrwydfN68kLVNf-o'
            }
        };

        fetch(`https://api.themoviedb.org/3/movie/${id}?language=es-ES`, options)
          .then(response => response.json())
          .then((response) => {
            setStore({ movie: response });
            console.log(response);
            console.log(getStore().movie);
          })
          .catch(err => console.error(err));
  
      },
      getSerie: async (id) => { 
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MTUwZDQyNjQ2NGQxOGY0ZGRjMGM3ZWEwZjFjNTU2MyIsInN1YiI6IjY2NDI0ZTQ3M2MzMGM1ZjRhYzNhMWQ3ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1qYEcWtzCfR7JEiJLg5B4Nn9WdrFrwydfN68kLVNf-o'
            }
        };

        fetch(`https://api.themoviedb.org/3/tv/${id}?language=es-ES`, options)
          .then(response => response.json())
          .then((response) => {
            setStore({ serie: response });
            console.log(response);
          })
          .catch(err => console.error(err));

      },

      addMovieToList: (list_id, movieTitle, overview, poster_path, release_date, tagline, runtime, api_id) => {
        const store = getStore();
        fetch(`${process.env.BACKEND_URL}/api/lists/${list_id}/add`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${store.token}`
            },
          body: JSON.stringify({movie:
            { title: movieTitle,
              overview: overview, 
              poster_path: poster_path,
                release_date: release_date, 
                tagline: tagline,
                runtime: runtime,
                api_id: api_id}})
          })
            .then(response => response.json())
            .then((response) => {
              getActions().getTraerTodasLasListas();
              console.log(response);
            })
            .catch(err => console.error(err));
        },

        addSerieToList: (list_id, name, overview, poster_path, first_air_date, api_id) => {
          const store = getStore();
          fetch(`${process.env.BACKEND_URL}/api/lists/${list_id}/add`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${store.token}`
              },
            body: JSON.stringify({serie:
              { name: name,
                overview: overview,
                  poster_path: poster_path,
                  first_air_date: first_air_date,
                    api_id: api_id}})
            })
              .then(response => response.json())
              .then((response) => {
                getActions().getTraerTodasLasListas();
                console.log(response);
              })
              .catch(err => console.error(err));
        },

        
      // Use getActions to call a function within a fuction
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },

      getMessage: async () => {
        try {
          // fetching data from the backend
          const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
          const data = await resp.json();
          setStore({ message: data.message });

          return data;
        } catch (error) {
         
        }
      },
      changeColor: (index, color) => {
        //get the store
        const store = getStore();

        //we have to loop the entire demo array to look for the respective index
        //and change its color
        const demo = store.demo.map((elm, i) => {
          if (i === index) elm.background = color;
          return elm;
        });

        //reset the global store
        setStore({ demo: demo });
      },

    },
  };
};

export default getState;
