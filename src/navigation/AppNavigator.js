import React from "react";

import { NavigationContainer } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";

import SignupScreen from "../screens/SignupScreen";

import ProjectsScreen from "../screens/ProjectsScreen";

import TasksScreen from "../screens/TasksScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = ({ initialRoute }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen name="Signup" component={SignupScreen} />

        <Stack.Screen name="Projects" component={ProjectsScreen} />

        <Stack.Screen name="Tasks" component={TasksScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
