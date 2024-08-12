import { useContext } from "react";
import {
  ScrollView,
  View,
  useWindowDimensions,
  Text,
  StyleSheet,
  Platform,
  Image,
} from "react-native";
import HTML from "react-native-render-html";
import { UserContext } from "../../context/UserContext";
import HTMLView from 'react-native-htmlview';
import { URL } from "../../constants/url";

const GeneralInfo = ({ route }) => {
  const userCntx = useContext(UserContext);
  const eventId = route.params.eventId;
  const { tips, dressCode, dressCodeImage, banner } = userCntx.events.find(
    (event) => event.id === eventId
    
  );
  const { width } = useWindowDimensions();
  return (
    <ScrollView>
      <View style={styles.shadow}>
        <Image style={styles.image} source={{ uri: `${URL}${dressCodeImage}` }} />
      </View>
      <View>
        <View style={styles.scroll}>
          <Text style={[styles.tips, styles.subtitle]}>
            Código de Vestimenta:
          </Text>
          <HTML
                    source={{ html: dressCode }}
                    ignoredDomTags={["font"]}
                    contentWidth={350}
                  />
        </View>
        <View style={styles.scroll}>
          <Text style={[styles.tips, styles.subtitle]}>Tips de viaje:</Text>
          <HTML
                    source={{ html: tips }}
                    ignoredDomTags={["font"]}
                    contentWidth={350}
                  />
        </View>
      </View>
    </ScrollView>
  );
};

export default GeneralInfo;


const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300,
  },
  scroll: {
    padding: 10,
  },
  shadow: {
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  tips: {
    marginBottom: 15,
  },
});
