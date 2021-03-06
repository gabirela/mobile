import { AxiosError } from "axios";
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    KeyboardAvoidingView,
    TextInput,
    StyleSheet,
    Alert,
} from "react-native";
import { Button, ButtonText, Loading } from "../../components";
import { useAuth } from "../../hook/auth";
import { IAuthenticate, IUser } from "../../interfaces/User.interface";
import colors from "../../styles/Colors";
import { LoginTypes } from "../../types/ScreenStack.types";

export default function Login({ navigation }: LoginTypes) {
    const { signIn } = useAuth();
    const [data, setData] = useState<IAuthenticate>();
    const [isLoading, setIsLoading] = useState(true);

    function handleCadastrar() {
        navigation.navigate("Cadastrar");
    }
    function handleHome() {
        navigation.navigate("HomeStack");
    }
    function handleChange(item: IAuthenticate) {
        setData({ ...data, ...item });
    }
    async function handleSignIn() {
        try {
            setIsLoading(true);
            if (data?.email && data.password) {
                await signIn(data);
            } else {
                Alert.alert("Preencha todos os campos!!!");
                setIsLoading(false);
            }
        } catch (error) {
            const err = error as AxiosError;
            const data = err.response?.data as IUser;
            let message = "";
            if (data.data) {
                for (const [key, value] of Object.entries(data.data)) {
                    message = `${message} ${value}`;
                }
            }
            Alert.alert(`${data.message} ${message}`);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        setIsLoading(false);
    }, []);

    return (
        <>
            {
                isLoading ? (
                    <Loading />
                ) : (

                    <View style={styles.container} >
                        <KeyboardAvoidingView>
                            <Text style={styles.title}> ReadingApp </Text>
                            < View style={styles.formRow} >
                                <Text style={styles.label}> E - mail </Text>
                                < TextInput
                                    style={styles.input}
                                    placeholder="e-mail"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    onChangeText={(i) => handleChange({ email: i })
                                    }
                                > </TextInput>
                            </View>
                            < View style={styles.formRow} >
                                <Text style={styles.label}> Senha </Text>
                                < TextInput
                                    style={styles.input}
                                    placeholder="senha"
                                    secureTextEntry={true}
                                    onChangeText={(i) => handleChange({ password: i })}
                                > </TextInput>
                            </View>
                            < Button title="Login" onPress={handleSignIn} />
                            <ButtonText title="Cadastre-se" onPress={handleCadastrar} />
                        </KeyboardAvoidingView>
                    </View>
                )}
        </>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 36,
        color: colors.black,
        fontWeight: "500",
        marginBottom: 20,
        textAlign: "center",
    },
    formRow: {
        margin: 10,
        flexDirection: "row",
    },
    label: {
        fontSize: 18,
        color: colors.black,
        padding: 5,
    },
    input: {
        borderBottomWidth: 1,
        fontSize: 18,
        padding: 5,
        width: "50%",
        marginLeft: 5,
        marginBottom: 5,
    },
});