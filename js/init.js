function fetchData(funcion, url) {
    try {
      return fetch(url)
      .then(response => response.json())
      .then(data => {
        funcion(data);
      })
    } catch {
      console.log("Error");
    };
  };