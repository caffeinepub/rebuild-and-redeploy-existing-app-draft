import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor Backend {
  let storage = Storage.new();
  include MixinStorage(storage);

  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);

  var members : OrderedMap.Map<Principal, Member> = principalMap.empty();
  var products : OrderedMap.Map<Text, Product> = textMap.empty();

  type Member = {
    id : Principal;
    name : Text;
    points : Nat;
    avatar : ?Storage.ExternalBlob;
  };

  type Product = {
    id : Text;
    name : Text;
    description : Text;
    cost : Nat;
  };

  public shared ({ caller }) func registerMember(name : Text) : async () {
    if (principalMap.contains(members, caller)) {
      Debug.trap("Member already exists");
    };

    let newMember : Member = {
      id = caller;
      name;
      points = 100; // Welcome points
      avatar = null;
    };

    members := principalMap.put(members, caller, newMember);
  };

  public shared ({ caller }) func updateAvatar(avatar : Storage.ExternalBlob) : async () {
    switch (principalMap.get(members, caller)) {
      case null { Debug.trap("Member not found") };
      case (?member) {
        let updatedMember : Member = {
          id = member.id;
          name = member.name;
          points = member.points;
          avatar = ?avatar;
        };
        members := principalMap.put(members, caller, updatedMember);
      };
    };
  };

  public shared ({ caller }) func purchaseProduct(productId : Text) : async () {
    switch (principalMap.get(members, caller)) {
      case null { Debug.trap("Member not found") };
      case (?member) {
        switch (textMap.get(products, productId)) {
          case null { Debug.trap("Product not found") };
          case (?product) {
            if (member.points < product.cost) {
              Debug.trap("Insufficient points");
            };

            let updatedMember : Member = {
              id = member.id;
              name = member.name;
              points = member.points - product.cost;
              avatar = member.avatar;
            };

            members := principalMap.put(members, caller, updatedMember);
          };
        };
      };
    };
  };

  public shared func addProduct(id : Text, name : Text, description : Text, cost : Nat) : async () {
    let newProduct : Product = {
      id;
      name;
      description;
      cost;
    };

    products := textMap.put(products, id, newProduct);
  };

  public query func getMember(id : Principal) : async ?Member {
    principalMap.get(members, id);
  };

  public query func getProduct(id : Text) : async ?Product {
    textMap.get(products, id);
  };

  public query func getAllProducts() : async [Product] {
    Iter.toArray(textMap.vals(products));
  };
};
