import { data } from "./data/MOCK_DATA";
import DeploymentCard from "./exercise/DeploymentCard";
import SearchPlaceholder from "./exercise/example2";
import Example3 from "./exercise/example3";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";

const App = () => {
  return (
    <Tabs defaultSelectedKey="exercise1">
      <TabsList>
        <TabsTrigger id="exercise1">Exercise 1</TabsTrigger>
        <TabsTrigger id="exercise2">Exercise 2</TabsTrigger>
        <TabsTrigger id="exercise3">Exercise 3</TabsTrigger>
      </TabsList>

      <TabsContent id="exercise1">
        <DeploymentCard
          deployment={
            data[0] as Parameters<typeof DeploymentCard>[0]["deployment"]
          }
        />
      </TabsContent>

      <TabsContent id="exercise2">
        <SearchPlaceholder
          deployments={
            data as Parameters<typeof SearchPlaceholder>[0]["deployments"]
          }
        />
      </TabsContent>

      <TabsContent id="exercise3">
        <Example3 />
      </TabsContent>
    </Tabs>
  );
};

export default App;
