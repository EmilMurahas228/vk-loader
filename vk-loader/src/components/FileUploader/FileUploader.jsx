import React, { Fragment, useContext, useState } from "react";
import axios from "axios";
import "./FileUploader.scss";
import { UploaderContext } from "../../context";

function FileUploader({ closeModal }) {
  const [files, setFiles] = useState([]);
  const [nameLoaded, setNameLoaded] = useState([]);

  const { setFilesGlobal } = useContext(UploaderContext);

  const onInputChange = (e) => {
    const inputFiles = e.target.files;

    const newFiles = { files: [], nameLoaded: [] };

    for (let i = 0; i < inputFiles.length; i++) {
      newFiles.nameLoaded.push(inputFiles[i].name);
      newFiles.files.push(inputFiles[i]);
    }

    setFiles((prevFiles) => [...prevFiles, ...newFiles.files]);
    setNameLoaded((prevNames) => [...prevNames, ...newFiles.nameLoaded]);
  };

  const onSubmit = (e) => {
    const data = new FormData();

    for (let i = 0; i < files.length; i++) {
      data.append("file", files[i]);
    }
    axios
      .post("http://localhost:8080/upload", data)
      .then((res) => setFilesGlobal(res.data))
      .catch((e) => console.log("eror", e));

    setNameLoaded([]);
    closeModal();
  };

  return (
    <form method="post" action="#" onSubmit={(e) => e.preventDefault()}>
      <div className="file-input">
        <input
          type="file"
          id="file"
          className="button button-file"
          onChange={onInputChange}
          multiple
        />
        <label htmlFor="file" className="button button-label">
          Выбрать файл
        </label>
      </div>
      {nameLoaded.length ? (
        <Fragment>
          <div className="file__content">
            <span className="file__titles">Вы выбрали файлы:</span>
            <ul className="file__list">
              {nameLoaded.map((item, index) => (
                <li className="file__item" key={index}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <button className="button button-center" onClick={onSubmit}>
            Загрузить
          </button>
        </Fragment>
      ) : null}
    </form>
  );
}

export default FileUploader;
