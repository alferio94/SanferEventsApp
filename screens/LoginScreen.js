import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  ImageBackground,
} from "react-native";
import { ButtonCustom } from "../components/ui/ButtonCustom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { login } from "../util/http";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import bg from "../assets/bg.png";
import { showToast } from "../util/toast";

const LoginScreen = () => {
  const authCntx = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  function inputChangeHandler(inputIdentifier, enteredValue) {
    setFormData((currentInputs) => {
      return {
        ...currentInputs,
        [inputIdentifier]: enteredValue,
      };
    });
  }

  async function loginConfirm() {
    setLoading(true);
    const userData = await login(formData);
    if (userData) {
      authCntx.login(userData);
    } else {
      showToast("error", "Credenciales inválidas", "Por favor revisa tus credenciales");
    }
    setLoading(false);
  }

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.rootScreen}>
      <ImageBackground source={bg} style={[styles.background, styles.container]}>
        <View>
          <TextInput
            style={styles.textInput}
            placeholder="Correo Electrónico"
            value={formData.email}
            onChangeText={inputChangeHandler.bind(this, "email")}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Contraseña"
            secureTextEntry={true}
            value={formData.password}
            onChangeText={inputChangeHandler.bind(this, "password")}
          />
        </View>
        <ButtonCustom title={"Iniciar Sesión"} onPress={loginConfirm} />
        {/* <Text style={styles.link}>Aún no tienes una cuenta?</Text> */}
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 65,
    fontWeight: "bold",
    textAlign: "left",
    color: "#181818",
  },
  subtitle: {
    fontSize: 15,
    color: "#302E2E",
  },
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    backgroundColor: "white",
    padding: 10,
    marginVertical: 10,
    width: 300,
  },
  link: {
    color: "gray",
    marginVertical: 10,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});