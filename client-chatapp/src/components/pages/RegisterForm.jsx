import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { registerUser } from "../../Services/authService";
import AvatarModal from "../common/avatarModal";

function RegisterForm() {
  const [showAvatars, setShowAvatars] = useState(false); // props pour gérer les avatars
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    avatar: "",
    password: "",
    confirmPassword: "",
  });

  // Gestion des changements dans les champs
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Gestion de la soumission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (!form.checkValidity()) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    // Vérification des deux mots de passe
    const passwordMatch = formData.password === formData.confirmPassword;

    passwordMatch
      ? setError("")
      : setError("Les deux mots de passe ne correspondent pas.");

    if (!passwordMatch) return;

    setError("");
    setLoading(true);
    setValidated(true);

    try {
      //Appel de l'API
      const { firstName, lastName, email, phone, avatar, password } = formData;

      await registerUser({
        name: `${firstName.trim()} ${lastName.trim()}`,
        email,
        phone,
        avatar,
        password,
      });

      navigate("/", {
        state: {
          success: "Compte créé avec succès. Connectez-vous.",
        },
      });
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
        <h2>Rejoignez GoChat</h2>
        <p>Créez votre compte pour commencer à collaborer.</p>
      </div>

      {error && <div className="alert-message error">{error}</div>}

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <div className="form-row">
          <Form.Group className="mb-3">
            <Form.Label>Prénom</Form.Label>
            <Form.Control
              required
              type="text"
              name="firstName"
              placeholder="Votre prénom"
              value={formData.firstName}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Veuillez saisir votre prénom.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              required
              type="text"
              name="lastName"
              placeholder="Votre nom"
              value={formData.lastName}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Veuillez saisir votre nom.
            </Form.Control.Feedback>
          </Form.Group>
        </div>

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
          <Form.Control.Feedback type="invalid">
            Veuillez saisir une adresse email valide.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Numéro de téléphone</Form.Label>
          <Form.Control
            required
            type="text"
            name="phone"
            placeholder="+225 0700000000"
            value={formData.phone}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Veuillez saisir un numéro de téléphone valide.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Photo de profil</Form.Label>

          <div className="avatar-selection">
            {formData.avatar && (
              <img
                src={formData.avatar}
                alt="Avatar sélectionné"
                className="selected-avatar"
              />
            )}

            <button
              type="button"
              className="choose-avatar-link"
              onClick={() => setShowAvatars(true)}
            >
              {formData.avatar ? "Changer d'avatar" : "Choisir un avatar"}
            </button>
          </div>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control
            required
            minLength={8}
            type="password"
            name="password"
            placeholder="8 caractères minimum"
            value={formData.password}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Le mot de passe doit contenir au moins 8 caractères.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Confirmation du mot de passe</Form.Label>

          <Form.Control
            required
            minLength={8}
            type="password"
            name="confirmPassword"
            placeholder="Confirmez votre mot de passe"
            value={formData.confirmPassword}
            onChange={handleChange}
            isInvalid={
              formData.confirmPassword !== "" &&
              formData.password !== formData.confirmPassword
            }
          />

          <Form.Control.Feedback type="invalid">
            {formData.password !== formData.confirmPassword
              ? "Les deux mots de passe ne correspondent pas."
              : "Veuillez confirmer votre mot de passe."}
          </Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" className="auth-button w-100" disabled={loading}>
          {loading ? "Création du compte..." : "Créer mon compte"}
        </Button>
      </Form>

      <div className="auth-footer">
        Vous avez déjà un compte ? <Link to="/">Se connecter</Link>
      </div>
      <AvatarModal
        show={showAvatars}
        onHide={() => setShowAvatars(false)}
        selectedAvatar={formData.avatar}
        onSelect={(avatar) =>
          setFormData({
            ...formData,
            avatar: avatar,
          })
        }
      />
    </div>
  );
}

export default RegisterForm;

//handleChange récupère les valeurs saisies.
//setFormData actualise les données.
//handleSubmit vérifie les données et appelle l'API.
//AvatarModal ne connaît pas directement le formulaire. Il reçoit les informations nécessaires grâce aux props (show, onHide, selectedAvatar, onSelect).
