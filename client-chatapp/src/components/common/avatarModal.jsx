
import Modal from "react-bootstrap/Modal";//pour l'affichage de l'avatar
import avatars from "../../data/avatar";

function AvatarModal({ show, onHide, selectedAvatar, onSelect }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Choisir un avatar</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="avatar-gallery">
          {avatars.map((avatar) => (
            <img
              key={avatar.id}
              src={avatar.url}
              alt={avatar.name}
              className={`avatar-item ${
                selectedAvatar === avatar.url ? "selected" : ""
              }`}
              onClick={() => {
                onSelect(avatar.url);
                onHide();
              }}
            />
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AvatarModal;
