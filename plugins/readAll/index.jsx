const {
  util: { getFiber, reactFiberWalker },
  flux: { dispatcher },
  observeDom,
} = shelter;

const { Button, ButtonSizes } = shelter.ui;
const { subscribe } = shelter.plugin.scoped.flux;

function readAll() {
  const channels = [];

  Object.values(shelter.flux.stores.GuildStore.getGuilds()).forEach((guild) => {
    shelter.flux.stores.GuildChannelStore.getChannels(guild.id)
      .SELECTABLE // Array<{ channel, comparator }>
      .concat(shelter.flux.stores.GuildChannelStore.getChannels(guild.id).VOCAL) // Array<{ channel, comparator }>
      .concat(
        Object.values(
          shelter.flux.stores.ActiveJoinedThreadsStore.getActiveJoinedThreadsForGuild(
            guild.id
          )
        ).flatMap((threadChannels) => Object.values(threadChannels))
      )
      .forEach((c) => {
        if (!shelter.flux.stores.ReadStateStore.hasUnread(c.channel.id)) return;

        channels.push({
          channelId: c.channel.id,
          messageId: shelter.flux.stores.ReadStateStore.lastMessageId(
            c.channel.id
          ),
          readStateType: 0,
        });
      });
  });

  console.log(channels);

  dispatcher.dispatch({
    type: "BULK_ACK",
    context: "APP",
    channels: channels,
  });
}

const ReadAllButton = () => (
  <div
    style="text-align: center; width: 100%; margin-top: 5px; margin-bottom: 10px;"
  >
    <Button
      size={ButtonSizes.MIN}
      style="width: 100%; height: 5px;"
      onClick={readAll}
    >
      Read All
    </Button>
  </div>
);

function handleElement(elem) {
    if (elem.dataset.readall) return;
    elem.dataset.readall = 1;


  let parent = elem.parentElement;

  parent.insertBefore(ReadAllButton(), parent.childNodes[1]);

  triggers.forEach(trigger => unsubscribe(trigger, handleDispatch));
}

function handleDispatch(payload) {
  const unObserve = observeDom("[aria-label='Servers']", (elem) => {
    handleElement(elem);
    unObserve();
  });

  setTimeout(unObserve, 500);
}

const triggers = ["LAYER_POP", "GUILD_SUBSCRIPTIONS_FLUSH"]

triggers.forEach(trigger => subscribe(trigger, handleDispatch));
