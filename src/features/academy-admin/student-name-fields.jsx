export function StudentNameFields({ copy, student = {} }) {
  return ["firstName", "lastName"].map((name) => (
    <label key={name}>
      {copy[name]}
      <input
        name={name}
        defaultValue={student[name] ?? ""}
        autoComplete={name === "firstName" ? "given-name" : "family-name"}
        required
        maxLength={80}
      />
    </label>
  ));
}
