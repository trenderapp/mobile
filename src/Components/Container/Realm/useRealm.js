import { useContext } from "react";
import RealmContext from "./RealmContext";

export default function useRealm() {
    const realm = useContext(RealmContext);
    
    return realm;
}