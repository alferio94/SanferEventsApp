import { useLayoutEffect, useState } from "react";
import { WebView } from "react-native-webview";
import { getSurvey } from "../../util/http";
import { View } from "react-native";
import { FlatList } from "react-native";
import SurveyItem from "../../components/app/EventDetails/formItem";
import { Text } from "react-native";

const Survey = ({ route }) => {
  const eventId = route.params.eventId;
  const [survey, setSurvey] = useState([]);
  async function getSurveys() {
    const surveryDetails = await getSurvey(eventId);
    surveryDetails && setSurvey(surveryDetails);
  }
  useLayoutEffect(() => {
    getSurveys();
  }, []);
  return (
    <View style={{ paddingHorizontal: 10 }}>
      {survey.length > 0 ? (
        <FlatList
          data={survey}
          renderItem={({ item }) => <SurveyItem item={item} />}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text>Aún no se ha creado encuesta</Text>
      )}
    </View>
  );
};

export default Survey;
