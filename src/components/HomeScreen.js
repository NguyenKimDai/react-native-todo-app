import React, { Component } from "react";
import { FlatList, Alert, View, Modal, TouchableHighlight } from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  Fab,
  Item,
  Input,
  Card,
  CardItem,
  Spinner
} from "native-base";
import styles from "../styles/mainstyle.js";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    console.log(this);
    this.tasksRef = props.firebaseApp.database().ref();
    this.state = {
      text: "",
      edittext: "",
      editValue: null,
      modalVisible: false,
      editKey: null
    };
  }

  componentDidMount() {
    this.outputData();
  }

  inputData() {
    if (this.state.text !== "") {
      this.tasksRef.push({ noiDung: this.state.text });
      this.setState({ text: "" }, () => this.outputData());
    } else {
      Alert.alert("Data is empty!");
    }
  }

  outputData() {
    const tasks = [];
    this.tasksRef.on("child_added", dataSnapShot => {
      tasks.push({
        name: dataSnapShot.val().noiDung,
        _key: dataSnapShot.key
      });
      // console.log("task", tasks);
      this.setState({
        tasks
      });
    });
    this.setState({
      tasks
    });
  }

  removeData = item => {
    Alert.alert("Remove?", "Are you sure?", [
      {
        text: "OK",
        onPress: () => {
          this.tasksRef.child(item._key).remove();
          this.outputData();
        }
      },
      {
        text: "Cancel",
        onPress: () => console.log("Cancel")
      }
    ]);
  };

  renderItem = ({ item }) => {
    // console.log("item", item);
    return (
      <Card>
        <CardItem>
          <Left style={{ flex: 1 }}>
            <Button
              transparent
              onPress={() => this.showEditModal(true, item.name, item._key)}
            >
              <Icon name="create" />
            </Button>
          </Left>
          <Body style={{ justifyContent: "center", flex: 5 }}>
            <Text>
              {item.name}
            </Text>
          </Body>
          <Right style={{ flex: 1 }}>
            <Button transparent onPress={() => this.removeData(item)}>
              <Icon name="trash" />
            </Button>
          </Right>
        </CardItem>
      </Card>
    );
  };

  showEditModal(visible, name, editKey) {
    this.setState({ modalVisible: visible, editValue: name, editKey });
  }

  updateData = newData => {
    console.log(this.tasksRef);
    let updates = {};
    updates["noiDung"] = newData;
    this.tasksRef.update(updates);
    // this.props.firebaseApp.database().ref("users/" + userId).set({
    //   username: name,
    //   email: email,
    //   profile_picture: imageUrl
    // });
    this.setState({ modalVisible: false });
  };

  render() {
    // console.log(this.state.tasks);
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>Todo List</Title>
          </Body>
          <Right />
        </Header>

        <Content padder style={{ backgroundColor: "#f0f0f0" }}>
          <FlatList
            renderSeparator={() => {}}
            data={this.state.tasks}
            keyExtractor={(item, index) => index}
            renderItem={this.renderItem}
          />
          <Modal
            animationType={"slide"}
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {}}
          >
            <Item regular style={{ height: 60 }}>
              <Input
                value={this.state.editValue}
                onChangeText={text => this.setState({ editValue: text })}
              />
            </Item>
            <Right>
              <Button onPress={() => this.updateData()} full>
                <Text>Done</Text>
              </Button>
            </Right>
          </Modal>
        </Content>

        <Footer style={styles.footer}>
          <Left style={{ flex: 5 }}>
            <Item regular>
              <Input
                placeholder="Note here"
                onChangeText={text => this.setState({ text })}
                value={this.state.text}
              />
            </Item>
          </Left>
          <Right style={{ flex: 1 }}>
            <Fab
              containerStyle={{ marginRight: 0, width: 20, marginBottom: -48 }}
              style={styles.floatButton}
              position="bottomRight"
              onPress={() => this.inputData()}
            >
              <Icon name="md-add" />
            </Fab>
          </Right>
        </Footer>
      </Container>
    );
  }
}
