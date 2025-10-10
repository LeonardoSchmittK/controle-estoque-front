package com.controleestoquefront.controle.estoque.front;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.layout.StackPane;
import javafx.stage.Stage;

public class App extends Application {

    @Override
    public void start(Stage primaryStage) {
        // precisa rodar com mvn clean javafx:run
        
        Button btn = new Button("Hello JavaFX with Maven!");
        btn.setOnAction(e -> System.out.println("Hello world!"));

        StackPane root = new StackPane();
        root.getChildren().add(btn);

        Scene scene = new Scene(root, 400, 300);
        primaryStage.setTitle("JavaFX Hello world");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
