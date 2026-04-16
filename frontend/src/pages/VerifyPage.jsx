import { Link } from "react-router-dom";
import Verifier from "../components/Verifier";

export default function VerifyPage() {
  return (
    <div>

      <Verifier />

      <Link to="/game">
        Back to Game
      </Link>

    </div>
  );
}