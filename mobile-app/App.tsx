function AppShell() {
  const dispatch = useDispatch();
  useEffect(() => { /* auth listener */ }, [dispatch]);
  return (<NativeRouter><AppRoutes /></NativeRouter>);
}

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <AppShell />
      </PaperProvider>
    </Provider>
  );
}