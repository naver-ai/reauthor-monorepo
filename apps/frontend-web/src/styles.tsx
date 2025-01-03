import { ConfigProvider, ThemeConfig, theme as AntdTheme } from 'antd';
import tailwindColors from 'tailwindcss/colors';

export const theme: ThemeConfig = {
  token: {
    colorPrimary: tailwindColors.emerald[500],
    fontFamily:
      "'NanumSquareNeo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol','Noto Color Emoji'",
  },
  components: {
    Layout: {
      colorBgLayout: 'transparent',
      siderBg: 'white',
    },
    Divider: {
      orientationMargin: 0,
      textPaddingInline: 0,
    },
    Carousel: {
      // arrowOffset: 8
      arrowSize: 25
    }
  },
};

export const PartialDarkThemeProvider = (props: { children: any }) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: AntdTheme.darkAlgorithm,
        token: {
          colorPrimary: 'white'
        },
        components: {
          Progress: {
            defaultColor: 'white',
            remainingColor: 'rgba(255,255,255,0.45)',
          },
        },
      }}
    >
      {props.children}
    </ConfigProvider>
  );
};
