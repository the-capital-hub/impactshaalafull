import "./titleInput.scss";

const TitleInput = ({ title, value, onChange, name, type }) => {
  return (
    <div className="titleInput">
      <h5>{title}</h5>
      {type === 'file' ?
        <input
          type="file"
          name={name}
          id=""
          value={value}
          onChange={onChange}
          // required
        />
        :
        <input
          type="text"
          name={name}
          id=""
          value={value}
          onChange={onChange}
          required
        />
      }

    </div>
  );
};

export default TitleInput;
