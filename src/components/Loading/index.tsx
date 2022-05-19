/* @flow */
import React from 'react';
import { Animated, Easing, View, ActivityIndicator } from 'react-native';

type Props = {};

export default class Loading extends React.Component<any, any> {
  private animation = null;
  constructor(props: Props) {
    super(props);

    this.setAnimation = this.setAnimation.bind(this);
    this.state = {
      progress: new Animated.Value(0),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.progress, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
    }).start(() => this.animation && this.animation.play());
  }

  setAnimation(animation: any) {
    this.animation = animation;
  }

  render() {
    const { bgColor } = this.props;
    return (
      <View
        style={{
          flex: 1,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: bgColor || 'rgba(0,0,0,0.3)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100,
        }}>
        <View
          style={{
            width: 60,
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ffff',
            borderRadius: 5,
          }}>
          <ActivityIndicator color="red" />
        </View>
      </View>
    );
  }
}
