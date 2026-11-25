import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { loginUser } from "../../Services/authService";

function LoginForm() {
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(location.state?.success || "");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await loginUser(formData);

      // Conserver le JWT pour les prochaines requêtes
      localStorage.setItem("token", data.token);

      // Conserver les informations utiles de l'utilisateur
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess("Connexion réussie ! Bienvenue sur GoChat.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-heading">
        <div className="brand-icon">G</div>
        <h2>Bienvenue sur GoChat</h2>
        <p>Connectez-vous pour retrouver votre espace de travail.</p>
      </div>

      {success && <div className="alert-message success">{success}</div>}
      {error && <div className="alert-message error">{error}</div>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Adresse email</Form.Label>
          <Form.Control
            required
            type="email"
            name="email"
            placeholder="exemple@email.com"
            value={formData.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control
            required
            type="password"
            name="password"
            placeholder="Votre mot de passe"
            value={formData.password}
            onChange={handleChange}
          />
        </Form.Group>

        <Button type="submit" className="auth-button w-100" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </Button>
      </Form>

      <div className="auth-footer">
        Vous n'avez pas encore de compte ?{" "}
        <Link to="/register">Créer un compte</Link>
      </div>
    </div>
  );
}

export default LoginForm;
