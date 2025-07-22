import { useContext } from "react";
import {
  ScrollView,
  View,
  useWindowDimensions,
  Text,
  StyleSheet,
  Platform,
  Image,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import HTML from "react-native-render-html";
import { URL } from "../../constants/url";
import { AuthContext } from "../../context/AuthContext";

const GeneralInfo = ({ route }) => {
  const { events } = useContext(AuthContext);
  const eventId = route.params.eventId;
  const event = events.find((event) => event.id === eventId);
  const { extra, tips, banner } = event;
  const { width } = useWindowDimensions();

  const htmlSystemFonts = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Courier",
    "Courier New",
  ];

  const htmlRenderersProps = {
    a: {
      onPress: (event, href) => {
        if (href) {
          Linking.openURL(href);
        }
      },
    },
  };

  const renderBanner = () => {
    if (banner) {
      return (
        <Image
          style={styles.image}
          source={{ uri: event.banner || `${URL}${banner}` }}
        />
      );
    } else {
      return (
        <LinearGradient
          colors={["#ef3b42", "#ed353c"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.gradientText}>Información General</Text>
        </LinearGradient>
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      {renderBanner()}
      
      {!extra && !tips ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📄</Text>
          <Text style={styles.emptyTitle}>No hay información disponible</Text>
          <Text style={styles.emptyDescription}>
            No se ha proporcionado información adicional o tips para este evento.
          </Text>
        </View>
      ) : (
        <>
          {extra && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Información Extra</Text>
              <View style={styles.htmlContainer}>
                <HTML
                  source={{ html: extra }}
                  contentWidth={width - 40}
                  systemFonts={htmlSystemFonts}
                  renderersProps={htmlRenderersProps}
                />
              </View>
            </View>
          )}
          {tips && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tips</Text>
              <View style={styles.htmlContainer}>
                <HTML
                  source={{ html: tips }}
                  contentWidth={width - 40}
                  systemFonts={htmlSystemFonts}
                  renderersProps={htmlRenderersProps}
                />
              </View>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

export default GeneralInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  image: {
    width: "100%",
    height: 200,
  },
  gradient: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  gradientText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  section: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#ef3b42",
    paddingBottom: 8,
  },
  htmlContainer: {
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    minHeight: 200,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
