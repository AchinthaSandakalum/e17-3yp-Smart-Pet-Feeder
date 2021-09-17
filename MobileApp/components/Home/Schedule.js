import * as React from "react";
import {
  Card,
  Title,
  Paragraph,
  Button,
  IconButton,
  Avatar,
  Subheading,
  Text,
} from "react-native-paper";
import { StyleSheet, View } from "react-native";
import Styles from "../../config/Styles";

import * as Functions from "../../helpers/functions";
import {
  getNumberOfDays,
  getNumberOfHours,
  isExceedDay,
} from "../../helpers/functions";
import ColorsApp from "../../config/ColorsApp";

const Schedule = (props) => {
  return (
    <Card style={Styles.card6}>
      <View style={Styles.cardTitle}>
        <Title
          style={{
            fontSize: 22,
            fontWeight: "bold",
            // fontFamily: "loobster",
            // capitalize: true,
          }}
        >
          {props.schedule.title.toUpperCase()}
        </Title>
      </View>

      <View style={Styles.cardContent}>
        <Text
          style={{
            fontSize: 28,
            color: ColorsApp.PRIMARY,
            fontWeight: "bold",
            fontFamily: "bebas-neue",
          }}
        >
          AFTER{" "}
          {!Functions.isExceedDay(props.schedule.date_time) &&
            Functions.getNumberOfHours(props.schedule.date_time)}
          {Functions.isExceedDay(props.schedule.date_time) &&
            Functions.getNumberOfDays(props.schedule.date_time)}
        </Text>
      </View>

      <View style={Styles.cardContent}>
        <View style={Styles.cardContent}>
          <Avatar.Icon
            size={26}
            icon="calendar"
            backgroundColor={ColorsApp.PRIMARY}
          />
          <Text
            style={{ paddingLeft: 15, fontFamily: "bebas-neue", fontSize: 20 }}
          >
            {Functions.extractDate(new Date(props.schedule.date_time))}
          </Text>
        </View>

        <View style={Styles.cardContent}>
          <Avatar.Icon
            size={26}
            icon="clock-time-nine-outline"
            backgroundColor={ColorsApp.PRIMARY}
          />
          <Text
            style={{ paddingLeft: 15, fontFamily: "bebas-neue", fontSize: 20 }}
          >
            {Functions.extractTime(new Date(props.schedule.date_time))}
          </Text>
        </View>
      </View>

      <View style={Styles.cardButtons}>
        <Button
          onPress={props.onEditSchedule.bind(null, props.schedule.id)}
          // color="blue"
          color={ColorsApp.PRIMARY}
        >
          EDIT
        </Button>
        <Button
          onPress={props.onDeleteSchedule.bind(null, props.schedule.id)}
          // color="blue"
          color={ColorsApp.PRIMARY}
        >
          DELETE
        </Button>
      </View>
    </Card>
  );
};

export default Schedule;