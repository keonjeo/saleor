import * as React from "react";

import Messages from "../../components/messages";
import Navigator from "../../components/Navigator";
import { WindowTitle } from "../../components/WindowTitle";
import i18n from "../../i18n";
import { getMutationState, maybe } from "../../misc";
import { CollectionCreateInput } from "../../types/globalTypes";
import CollectionCreatePage from "../components/CollectionCreatePage/CollectionCreatePage";
import { TypedCollectionCreateMutation } from "../mutations";
import { CreateCollection } from "../types/CreateCollection";
import { collectionListUrl, collectionUrl } from "../urls";

export const CollectionCreate: React.StatelessComponent<{}> = () => (
  <Messages>
    {pushMessage => (
      <Navigator>
        {navigate => {
          const handleCollectionCreateSuccess = (data: CreateCollection) => {
            if (data.collectionCreate.errors.length === 0) {
              pushMessage({
                text: i18n.t("Created collection", {
                  context: "notification"
                })
              });
              navigate(collectionUrl(data.collectionCreate.collection.id));
            } else {
              const backgroundImageError = data.collectionCreate.errors.find(
                error =>
                  error.field ===
                  ("backgroundImage" as keyof CollectionCreateInput)
              );
              if (backgroundImageError) {
                pushMessage({
                  text: backgroundImageError.message
                });
              }
            }
          };
          return (
            <TypedCollectionCreateMutation
              onCompleted={handleCollectionCreateSuccess}
            >
              {(createCollection, { called, data, loading }) => {
                const formTransitionState = getMutationState(
                  called,
                  loading,
                  maybe(() => data.collectionCreate.errors)
                );
                return (
                  <>
                    <WindowTitle title={i18n.t("Create collection")} />
                    <CollectionCreatePage
                      errors={maybe(() => data.collectionCreate.errors, [])}
                      onBack={() => navigate(collectionListUrl)}
                      disabled={loading}
                      onSubmit={formData =>
                        createCollection({
                          variables: {
                            input: {
                              backgroundImage: formData.backgroundImage.value,
                              backgroundImageAlt: formData.backgroundImageAlt,
                              description: formData.description,
                              isPublished: formData.isPublished,
                              name: formData.name,
                              seo: {
                                description: formData.seoDescription,
                                title: formData.seoTitle
                              }
                            }
                          }
                        })
                      }
                      saveButtonBarState={formTransitionState}
                    />
                  </>
                );
              }}
            </TypedCollectionCreateMutation>
          );
        }}
      </Navigator>
    )}
  </Messages>
);
export default CollectionCreate;
