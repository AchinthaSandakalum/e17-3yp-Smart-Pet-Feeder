import React, { useReducer, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { TextInput, Button, Avatar, IconButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import useInput from "../../hooks/use-input";
import * as Validators from "../../helpers/validators";
import * as ScheduleActions from "../../store/actions/schedules";

import Strings from "../../config/Strings";
import Icon from "react-native-dynamic-vector-icons/lib/Icon";
import { useSelector, dispatch } from "react-redux";
import { isValidString } from "../../helpers/validators";

const extractDate = (date) => {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

const extractTime = (time) => {
  let hour = time.getHours();
  let min = time.getMinutes();

  if (min < 10) min = "0" + min;
  if (hour < 10) hour = "0" + hour;
  //
  return hour + ":" + min;
};

const ScheduleForm = (props) => {
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const schedule = useSelector((state) =>
    state.schedules.schedules.find((schedule) => schedule.id === props.id)
  );

  const [dateOrTime, setDateOrTime] = useState(
    new Date(Date.parse(schedule.date_time))
  );
  console.log(new Date().toString());
  const [isValidDateTime, setIsValidDateTime] = useState(!!schedule);
  const {
    value: title,
    isValid: titleIsValid,
    hasError: titleHasError,
    valueChangeHandler: titleChangeHandler,
    inputBlurHandler: titleBlurHandler,
    reset: resetTitle,
  } = useInput(schedule ? schedule.title : "", Validators.isNotEmpty);

  const isFormValid = !titleHasError && isValidDateTime;
  const submitHandler = () => {
    if (!isFormValid) {
      return;
    }

    if (schedule) {
      dispatch(ScheduleActions.updateSchedule(schedule.id, title, dateOrTime));
    } else {
      dispatch(ScheduleActions.createSchedule(title, dateOrTime));
    }
  };

  const onChangeDateOrTime = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setShow(false);
      return;
    }
    const currentDate = selectedDate || dateOrTime;
    setShow(Platform.OS === "ios");
    setDateOrTime(currentDate);
    if (currentDate < Date.now()) {
      setIsValidDateTime(false);
    } else {
      setIsValidDateTime(true);
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal
        isVisible={props.isModalVisible}
        backdropOpacity={0.8}
        onBackdropPress={props.hideModal}
      >
        <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
          <View style={Styles.Container}>
            <View style={Styles.Details}>
              <View style={Styles.Inline}>
                <View style={{ flex: 10 }}>
                  <TextInput
                    label="Title"
                    // onChangeText={(text) => setEmail(text)}
                    mode="flat"
                    autoCapitalize="none"
                    value={title}
                    onChangeText={titleChangeHandler}
                    onBlur={titleBlurHandler}
                    style={Styles.Input}
                  />
                </View>

                <View style={{ flex: 1 }} />
              </View>

              {titleHasError && (
                <View style={Styles.Error}>
                  <Text style={{ color: "red" }}>Title cannot be empty</Text>
                </View>
              )}

              <View style={Styles.Inline}>
                <View style={{ flex: 10 }}>
                  <TextInput
                    label="Date"
                    // onChangeText={(text) => setEmail(text)}
                    mode="flat"
                    autoCapitalize="none"
                    style={Styles.Input}
                    value={extractDate(dateOrTime)}
                    editable={false}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Button
                    style={Styles.Button}
                    size={30}
                    onPress={showDatepicker}
                  >
                    <Icon
                      name="calendar"
                      type="AntDesign"
                      size={26}
                      color="purple"
                      onPress={() => {}}
                    />
                  </Button>
                </View>
              </View>

              <View style={Styles.Inline}>
                <View style={{ flex: 10 }}>
                  <TextInput
                    label="Time"
                    // onChangeText={(text) => setEmail(text)}
                    mode="flat"
                    autoCapitalize="none"
                    style={Styles.Input}
                    value={extractTime(dateOrTime)}
                    // value={title}

                    editable={false}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Button
                    style={Styles.Button}
                    size={30}
                    onPress={showTimepicker}
                  >
                    <Icon
                      name="clockcircleo"
                      type="AntDesign"
                      size={26}
                      color="purple"
                      onPress={() => {}}
                    />
                  </Button>
                </View>
              </View>

              {!isValidDateTime && (
                <View style={Styles.Error}>
                  <Text style={{ color: "red" }}>Invalid Date & Time</Text>
                </View>
              )}

              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={dateOrTime}
                  mode={mode}
                  is24Hour={true}
                  display="default"
                  onChange={onChangeDateOrTime}
                />
              )}

              <View style={Styles.ActionButton}>
                <TouchableOpacity onPress={props.hideModal}>
                  <Avatar.Icon icon="close" size={40} backgroundColor={"red"} />
                </TouchableOpacity>

                <TouchableOpacity onPress={submitHandler}>
                  <Avatar.Icon
                    icon="check"
                    size={40}
                    backgroundColor={"green"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const Styles = StyleSheet.create({
  Container: {
    marginLeft: "5%",
    width: "90%",
    height: 400,
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  Details: {
    marginHorizontal: 50,
  },

  Input: {
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  Inline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  ActionButton: {
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    paddingTop: 20,
  },

  Button: {
    height: 30,
    width: 30,
  },

  Error: {
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "center",
  },
});

export default ScheduleForm;
