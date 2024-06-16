import React, { Fragment, useState, useRef, useEffect } from "react";
import Dropzone from "react-dropzone";
import { marked } from "marked";

function App() {
  const selectRef = useRef(null);
  const [file, setFile] = useState(null);
  const [selectedTono, setSelectedValue] = useState("Creativo");

  const [brand, setBrand] = useState("");

  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState(null);

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const setInputBrand = (event) => {
    setBrand(event.target.value);
  };

  function handleClick(event) {
    event.preventDefault();
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageBase64 = event.target.result;
        const image = {
          inlineData: {
            data: imageBase64.split(",")[1],
            mimeType: imageBase64.split(";")[0].split(":")[1],
          },
        };
        const options = {
          method: "POST",
          body: JSON.stringify({
            image,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        };
        setProcessing(true);
        const response = await fetch(
          "http://localhost:3001/gemini/image",
          options
        );
        const data = await response.json();
        const description = data.response;
        let template = "";
        if (selectedTono === "Creativo") {
          template =
            "You must create a story with an introduction, middle, and end in a creative and original tone. " +
            " Keep in mind that the story is meant to advertise the brand " +
            brand +
            " and should also be based on the following " +
            " image description " +
            description +
            ". Provide the story in Latin Spanish";
        } else if (selectedTono === "Oscuro") {
          template =
            "Debes crear una historia con introducción, nudo, " +
            " y final en un tono oscuro y original. " +
            " Ten en cuenta que la historia está pensada para publicitar la marca  " +
            brand +
            " y también debe basarse en la siguiente descripción de imagen " +
            description;
        } else if (selectedTono === "Divertido") {
          template =
            "Debes crear una historia con introducción, nudo, " +
            " y final en un tono divertido y original. " +
            " Ten en cuenta que la historia está pensada para publicitar la marca " +
            brand +
            " y también debe basarse en la siguiente descripción de imagen. " +
            description;
        } else if (selectedTono === "Romantico") {
          template =
            "Debes crear una historia con introducción, nudo, " +
            " y final en un tono amistoso y original. " +
            " Ten en cuenta que la historia está pensada para publicitar la marca " +
            brand +
            " y también debe basarse en la siguiente descripción de imagen. " +
            description;
        } else if (selectedTono === "Melancolico") {
          template =
            "Debes crear una historia con introducción, nudo, " +
            " y final en un tono melancólico y original. " +
            " Ten en cuenta que la historia está pensada para publicitar la marca " +
            brand +
            " y también debe basarse en la siguiente descripción de imagen. " +
            description;
        } else if (selectedTono === "Inspiracional") {
          template =
            "Debes crear una historia con introducción, nudo, " +
            " y final en un tono inspirador y original. " +
            " Ten en cuenta que la historia está pensada para publicitar la marca " +
            brand +
            " y también debe basarse en la siguiente descripción de imagen. " +
            " Proporciona la historia en español latino. " +
            description;
        }
        const optionsText = {
          method: "POST",
          body: JSON.stringify({
            template,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        };
        const responseText = await fetch(
          "http://localhost:3001/gemini/text",
          optionsText
        );
        const dataText = await responseText.json();
        setProcessing(false);
        setResults(marked.parse(dataText.response));
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <Fragment>
      <div className="container-form">
        <section className="main__form">
          <form className="form" action="#" encType="multipart/form-data">
            <h1>Nuestra IA creará un texto único para tu historia</h1>
            <br />
            <br />
            <label>Brand: </label>
            <input
              type="text"
              placeholder="Nombre de la marca"
              value={brand}
              onChange={setInputBrand}
            />
            <br />
            <br />
            <label>Tono: </label>
            <select
              value={selectedTono}
              onChange={handleChange}
              ref={selectRef}
            >
              <option value="Creativo">Creativo</option>
              <option value="Oscuro">Oscuro</option>
              <option value="Divertido">Divertido</option>
              <option value="Romantico">Romantico</option>
              <option value="Melancolico">Melancólico</option>
              <option value="Inspiracional">Inspiracional</option>
            </select>
            <br />
            <br />
            <div className="form-file">
              <label className="title">
                Sube tu imagen y deja que tu historia inspire. <br />
                En MOTHERSHIP estamos contigo
              </label>
              <Dropzone onDrop={onDrop}>
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()}>
                    <div className="form-file__action" width="80%">
                      <input {...getInputProps()} />
                      <p>
                        Arrastre o suelte algun archivo aquí, o haga clic para
                        seleccionar archivo
                      </p>
                      <br />
                    </div>

                    {file && (
                      <div className="form-file__result">
                        {
                          <img
                            width="80%"
                            src={URL.createObjectURL(file)}
                            alt="Uploaded Image"
                          />
                        }
                      </div>
                    )}
                  </div>
                )}
              </Dropzone>
            </div>

            <button
              id="generateButton"
              onClick={handleClick}
              disabled={processing}
            >
              Generar historia
            </button>
            <br />
            <div className="form-fileP">
              {processing ? <p>Loading...</p> : null}
              {!processing && results && (
                <div>
                  <h2>Resultados de nuestra AI:</h2>
                  <div dangerouslySetInnerHTML={{ __html: results }}></div>
                </div>
              )}
            </div>

            <br />
          </form>
        </section>
      </div>
    </Fragment>
  );
}

export default App;
